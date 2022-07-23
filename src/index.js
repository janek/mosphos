import React, { useState, useCallback, useEffect } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
const contentful = require("contentful");
import "./style.css";

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [pictures, setPictures] = useState([]);

  const getPhotos = () => {
    const generateSrcSetString = (sizes, url) => {
      return sizes.map((size) => `${url}?w=${size}&fm=webp ${size}w`);
    };

    const client = contentful.createClient({
      space: "m81bq01yso83",
      accessToken: "IsdeovevvHYMD8tGweMBi132Aw1_ttFSEsyFo7rnLEE",
    });

    client
      .getAssets()
      .then((response) => {
        var info = response.items.map((i) => i.fields.file);

        info.map((i) => {
          i.src = i.url + "?w=1200&fm=webp";
          i.srcSet = generateSrcSetString([500, 800, 1024, 1600], i.url);
          i.sizes = [
            "(max-width: 600px) 50vw,(min-width: 1024px) 33.3vw,100vw",
          ];
          i.width = i.details.image.width;
          i.height = i.details.image.height;
        });

        //Randomize info array
        info = info.sort(() => 0.5 - Math.random());
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

  useEffect(() => {
    document.title = "Mo's Pho ' s";
  });

  return (
    <div>
      <h1 className={"main-heading"}>Mo's Pho ' s</h1>
      <a className={"contact-heading-link"} href="mailto:jan.szynal@gmail.com">
        <h1 className={"contact-heading"}>contact</h1>
      </a>
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
