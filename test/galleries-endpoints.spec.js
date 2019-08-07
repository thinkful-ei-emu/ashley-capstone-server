function makeGalleriesArray(){
  return [
    {
      id: 1,
      name: "GalleryOne"
    },
    {
      id: 2,
      name: "GalleryTwo"
    },
    {
      id: 3,
      name: "GalleryThree"
    }
  ];
}

function makeMaliciousGallery() {
  const maliciousGallery = {
    id: 911,
    name: 'Malicious Gallery <script>alert("xss");</script>',
   
  };
  const expectedGallery = {
    ...maliciousGallery,
    name: 'Malicious Gallery &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    
  };
  return {
    maliciousGallery,
    expectedGallery,
  };
}

module.exports = {makeGallerysArray, makeMaliciousGallery};