import React, { useContext, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

const EditVideo = ({ lesson, setLesson }) => {
  const [files, setFiles] = useState([]);
  const mediaBase = apiUrl?.replace(/\/api\/?$/, "");
  const videoUrl = lesson?.video ? `${mediaBase}/${lesson.video}` : null;
  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0 h5 border-bottom pb-3">Video</h4>
        </div>
        <FilePond
          acceptedFileTypes={["video/mp4", "video/avi", "video/mov"]}
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            process: {
              url: `${apiUrl}/save-lesson-video/${lesson.id}`,
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              onload: (response) => {
                response = JSON.parse(response);
                toast.success(response.message);
                const updateLessonData = {
                  ...lesson,
                  video: response.data.video,
                };
                setLesson(updateLessonData);
                setFiles([]);
              },
              onerror: (errors) => {
                console.log(errors);
              },
            },
          }}
          name="video"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />

        {videoUrl ? (
          <div className="mt-4 ratio ratio-16x9">
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
          <p className="text-muted mt-3 mb-0">No video uploaded yet.</p>
        )}
      </div>
      
    </div>
  );
};

export default EditVideo;
