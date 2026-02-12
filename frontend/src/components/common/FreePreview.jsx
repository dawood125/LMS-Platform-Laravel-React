import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { apiUrl } from "./Config";

const FreePreview = ({ show, handleClose, freeLesson }) => {
  const mediaBase = apiUrl?.replace(/\/api\/?$/, "");
  const rawVideoPath = freeLesson?.video?.trim();
  const isAbsoluteUrl = /^https?:\/\//i.test(rawVideoPath || "");
  const videoUrl = rawVideoPath
    ? (isAbsoluteUrl ? rawVideoPath : `${mediaBase}/${rawVideoPath}`)
    : null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{freeLesson?.title || "Free Preview"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {videoUrl && show ? (
          <div className="ratio ratio-16x9 mb-3">
            <video
              className="w-100 h-100"
              controls
              preload="metadata"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <p className="text-muted mb-0">
            Preview video is not available for this lesson.
          </p>
        )}

        {freeLesson?.description ? (
          freeLesson.description
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FreePreview;
