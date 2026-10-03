"""Serve this static site locally with byte-range support for scroll-scrubbed MP4s."""

from __future__ import annotations

import argparse
import os
import re
from email.utils import formatdate
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RANGE_PATTERN = re.compile(r"bytes=(\d*)-(\d*)\Z")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    """Add single byte-range responses for MP4 files; delegate other files."""

    _byte_range: tuple[int, int] | None = None

    def send_head(self):
        self._byte_range = None
        path = self.translate_path(self.path)
        if not path.lower().endswith(".mp4") or not os.path.isfile(path):
            return super().send_head()

        try:
            source = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(source.fileno()).st_size
        range_header = self.headers.get("Range")
        if range_header:
            match = RANGE_PATTERN.fullmatch(range_header.strip())
            if not match or (not match.group(1) and not match.group(2)):
                source.close()
                self._range_not_satisfiable(size)
                return None

            first, last = match.groups()
            if first:
                start = int(first)
                end = int(last) if last else size - 1
            else:
                suffix_length = int(last)
                start = max(0, size - suffix_length)
                end = size - 1

            if start >= size or end < start:
                source.close()
                self._range_not_satisfiable(size)
                return None

            end = min(end, size - 1)
            self._byte_range = (start, end)
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(end - start + 1))
        else:
            self.send_response(200)
            self.send_header("Content-Length", str(size))

        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Last-Modified", formatdate(os.path.getmtime(path), usegmt=True))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return source

    def copyfile(self, source, outputfile):
        byte_range = self._byte_range
        self._byte_range = None
        if byte_range is None:
            super().copyfile(source, outputfile)
            return

        start, end = byte_range
        source.seek(start)
        remaining = end - start + 1
        try:
            while remaining:
                chunk = source.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            # Browsers cancel open-ended metadata ranges after reading enough data.
            # That is a normal video-loading path, not a preview-server failure.
            return

    def _range_not_satisfiable(self, size: int) -> None:
        self.send_response(416)
        self.send_header("Content-Range", f"bytes */{size}")
        self.send_header("Content-Length", "0")
        self.end_headers()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8123)
    args = parser.parse_args()
    handler = partial(RangeRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving {ROOT} at http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
