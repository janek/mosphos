import React, { useState, useCallback, useEffect } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
// import { photos } from "./photos";
const contentful = require("contentful");

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [pictures, setPictures] = useState([]);

  const getPhotos = () => {
    const client = contentful.createClient({
      space: "m81bq01yso83",
      accessToken: "IsdeovevvHYMD8tGweMBi132Aw1_ttFSEsyFo7rnLEE",
    });

    client
      .getAssets()
      .then((response) => {
        const info = response.items.map((i) => i.fields.file);
        // rename info.url to info.src
        info.map((i) => {
          i.src = i.url;
          i.width = i.details.image.width;
          i.height = i.details.image.height;
        });

        console.log(info);
        setPictures(info);
      })
      .catch(console.error);
  };

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  useEffect(() => {
    getPhotos();
    console.log(pictures);
  }, []);

  return (
    <div>
      {/* <Gallery photos={photos} onClick={openLightbox} /> */}
      <Gallery photos={pictures} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={pictures.map((x) => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title,
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}
render(<App />, document.getElementById("app"));
