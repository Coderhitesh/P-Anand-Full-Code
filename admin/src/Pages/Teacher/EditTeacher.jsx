import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

function EditTeacher() {
  const { id } = useParams();
  const editor = useRef(null);
  const [categories, setCategories] = useState([]);
  const [allTags, setTags] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    teacherName: '',
    teacherAbout: '',
    currentlyGivingcourse: '',
    categoryId: '',
    teacherEmail: '',
    teacherImage: null,
    teacherQualification: '',
    teacherExperience: '',
    teacherExpertise: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    setFormData((prevFormData) => ({
      ...prevFormData,
      teacherImage: file
    }));
    setImagePreview(preview);
  };

  const handleCategoryChange = async (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryId: value,
      teacherEmail: ''
    }));

    if (value) {
      try {
        const response = await axios.get(`http://localhost:9000/api/v1/single-category/${value}`);
        setSubcategories(response.data.data.subcategoryName);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching the categories!', error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-tag');
      setTags(res.data.data);
    } catch (error) {
      console.error('Error fetching the tags!', error);
    }
  }, []);

  const fetchSingleProduct = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/single-course/${id}`);
      const data = res.data.data;
      setFormData({
        teacherName: data.teacherName,
        teacherAbout: data.teacherAbout,
        categoryId: data.categoryId,
        teacherEmail: data.teacherEmail,
        currentlyGivingcourse: data.currentlyGivingcourse,
        teacherImage: data.teacherImage.url,
        teacherQualification: data.teacherQualification || '',
        teacherExperience: data.teacherExperience || '',
        teacherExpertise: data.teacherExpertise
      });

      if (data.teacherImage) {
        setImagePreview(data.teacherImage.url);
      }
    } catch (error) {
      console.error('Error fetching the product!', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchSingleProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'teacherImage') {
          if (formData.teacherImage) {
            formDataToSend.append('teacherImage', formData.teacherImage);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      await axios.put(`http://localhost:9000/api/v1/update-course/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Course Updated Successfully');
      setIsLoading(false);
      window.location.href = "/all-courses";
    } catch (error) {
      console.error('Error:', error);
      toast.error('An Error Occurred');
      setIsLoading(false);
    }
  };

  const editorConfig = {
    readonly: false,
    height: 400
  };

  const handleEditorChange = useCallback((newContent) => {
    setFormData(prevFormData => ({ ...prevFormData, teacherAbout: newContent }));
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Course</h4>
        </div>
        <div className="links">
          <Link to="/all-courses" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryId" className="form-label">Category</label>
            <select onChange={handleCategoryChange} name='categoryId' value={formData.categoryId} className="form-select" id="categoryId">
              <option value="">Choose Category</option>
              {categories && categories.map((category, index) => (
                <option key={index} value={category._id}>{category.categoryName}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="teacherEmail" className="form-label">Sub Category</label>
            <select onChange={handleChange} name='teacherEmail' value={formData.teacherEmail} className="form-select" id="teacherEmail">
              <option value="">Choose Sub Category</option>
              {subcategories && subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="teacherName" className="form-label">Course Name</label>
            <input type="text" className="form-control" id="teacherName" name="teacherName" value={formData.teacherName} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="currentlyGivingcourse" className="form-label">Course Tags</label>
            <select className="form-select" id="currentlyGivingcourse" name="currentlyGivingcourse" value={formData.currentlyGivingcourse} onChange={handleChange}>
              {allTags && allTags.map((tag, index) => (
                <option key={index} value={tag._id}>{tag.tagName}</option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <label htmlFor="teacherAbout" className="form-label">Course Description</label>
            <JoditEditor
              ref={editor}
              value={formData.teacherAbout}
              config={editorConfig}
              onChange={handleEditorChange}
            />
          </div>

          <div className="col-md-12">
            {imagePreview && <img src={imagePreview} alt="Course Preview" className="img-preview" />}
            <label htmlFor="teacherImage" className="form-label">Course Image</label>
            <input type="file" className="form-control" id="teacherImage" name="teacherImage" onChange={handleFileChange} />
          </div>

          <div className="col-md-12 text-end">
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditTeacher;
