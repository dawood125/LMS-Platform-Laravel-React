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

const EditCover = ({ course, setCourse }) => {
    const [files, setFiles] = useState([]);
  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0 h5 border-bottom pb-3">Cover Image</h4>
        </div>
        <FilePond
          acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            process: {
              url: `${apiUrl}/save-course-image/${course.id}`,
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              onload: (response) => {
                response = JSON.parse(response);
                toast.success(response.message);
                const updateCourseData = {
                  ...course,
                  course_small_image: response.data.course_small_image,
                };
                setCourse(updateCourseData);
                setFiles([]);
              },
              onerror: (errors) => {
                console.log(errors);
              },
            },
          }}
          name="image"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
      </div>
      {course.course_small_image && (
        <div className="card-footer bg-white">
          <img
            src={course.course_small_image}
            alt="Course Cover"
            className="img-fluid rounded"
          />
        </div>
      )}
    </div>
  );
};

export default EditCover;
