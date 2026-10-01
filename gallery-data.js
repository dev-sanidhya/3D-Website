/*
 * Photo stories for gallery.html.
 * The names below are descriptive working titles based on the image sets; replace them
 * with the studio's official project names as those are confirmed. Add new photographs
 * to the matching project's photos array and keep the original dimensions with each one.
 */
(function () {
  function photo(id, alt, width, height) {
    return {
      id: id,
      alt: alt,
      width: width || 1600,
      height: height || 1200,
      orientation: (height || 1200) > (width || 1600) ? 'portrait' : 'landscape',
      thumbnail: 'assets/gallery/optimized/' + id + '-thumb.webp',
      full: 'assets/gallery/' + id + '.jpg',
    };
  }

  window.CH_GALLERY_PROJECTS = [
    {
      id: 'walnut-sage',
      title: 'Walnut & Sage',
      description: 'Warm walnut joinery, a muted green kitchen and open living spaces give this home a calm, connected feel.',
      features: ['Walnut joinery', 'Sage kitchen', 'Open living'],
      coverId: 'gallery-01',
      photos: [
        photo('gallery-01', 'Bedroom with walnut wall panelling and a built-in wardrobe'),
        photo('gallery-02', 'Wide view of the bedroom and walnut wardrobe wall'),
        photo('gallery-03', 'Closer view of the walnut wardrobe and room corner', 1600, 2134),
        photo('gallery-04', 'Wardrobe doors with curved inset panels'),
        photo('gallery-05', 'Timber storage beside a patterned glass screen', 1600, 2134),
        photo('gallery-06', 'Living room with built-in timber cabinetry'),
        photo('gallery-07', 'Open living area with timber storage and ceiling detail'),
        photo('gallery-08', 'Living room TV wall with walnut cabinetry and open shelves'),
        photo('gallery-09', 'Living room ceiling and built-in entertainment wall'),
        photo('gallery-10', 'View through the living room toward the dining area'),
        photo('gallery-11', 'Living room and balcony doors from a narrow angle', 1600, 2134),
        photo('gallery-12', 'Muted green kitchen with patterned tile backsplash', 1600, 2134),
        photo('gallery-13', 'Green kitchen cabinets beside the refrigerator', 1600, 2134),
        photo('gallery-14', 'Kitchen worktop and corner cabinetry', 1600, 2134),
        photo('gallery-15', 'Living room cabinetry and TV wall', 1600, 2134),
        photo('gallery-16', 'Timber wardrobe beside a bedroom window', 1600, 2134),
        photo('gallery-17', 'Bedroom with timber wardrobe and balcony doors'),
        photo('gallery-18', 'Wardrobe doors with arched wood inlays', 1600, 2134),
        photo('gallery-19', 'Living room with timber TV cabinetry and ceiling detail'),
        photo('gallery-20', 'TV wall and wardrobe in a warm timber finish'),
        photo('gallery-21', 'Built-in wardrobe and living room cabinetry'),
        photo('gallery-22', 'Wide view across the living room and timber storage'),
      ],
    },
    {
      id: 'oak-ivory',
      title: 'Oak & Ivory',
      description: 'Light cabinetry, warm timber and neatly integrated storage bring a quieter, more minimal character to this home.',
      features: ['Warm timber', 'Integrated storage', 'Soft neutrals'],
      coverId: 'gallery-29',
      photos: [
        photo('gallery-23', 'Bedroom with a timber bed and white fitted wardrobes', 1600, 2134),
        photo('gallery-24', 'Bedroom with white wardrobes and a timber bed'),
        photo('gallery-25', 'Alternate view of the bedroom and fitted wardrobes'),
        photo('gallery-26', 'Hallway with built-in storage and a timber door'),
        photo('gallery-27', 'Narrow hallway with a full-height storage unit', 1600, 2134),
        photo('gallery-28', 'Living area viewed through a timber-finished doorway', 1600, 2134),
        photo('gallery-29', 'Living room with a floating TV unit and warm timber accents', 1600, 2134),
        photo('gallery-30', 'Dining area and living room with white built-in cabinetry'),
        photo('gallery-31', 'Timber entry door with a patterned glass insert', 1600, 2134),
        photo('gallery-32', 'Entry door open to a patterned glass screen', 1600, 2134),
        photo('gallery-33', 'Detailed timber entrance door with a lit patterned panel', 1400, 2334),
      ],
    },
  ];
})();
