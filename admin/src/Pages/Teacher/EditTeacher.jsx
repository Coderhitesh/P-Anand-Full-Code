import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function EditTeacher() {
  const { id } = useParams();  // Get teacher ID from route
  const navigate = useNavigate();  // For redirecting after update
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    teacherName: '',
    teacherEmail: '',
    teacherQualification: '',
    teacherExperience: '',
    teacherExpertise: '',
    currentlyGivingcourse: [],
    teacherImage: null,
    categoryId: []
  });
  // console.log(imagePreview)
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all categories
  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-course');
      setAllCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch single teacher data by ID
  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`https://www.api.panandacademy.com/api/v1/single-teacher/${id}`);
      const teacherData = res.data.data;
      // console.log(res.data.data)

      // Pre-fill the form with fetched data
      setFormData({
        teacherName: teacherData.teacherName,
        teacherEmail: teacherData.teacherEmail,
        teacherQualification: teacherData.teacherQualification,
        teacherExperience: teacherData.teacherExperience,
        teacherExpertise: teacherData.teacherExpertise,
        currentlyGivingcourse: teacherData.currentlyGivingcourse || [],
        categoryId: teacherData.categoryId || [],
        teacherImage: null  // We'll handle image update separately
        
      });

      if(teacherData.teacherImage){
        setImagePreview(teacherData.teacherImage.url)
      }

      // Pre-select categories
      const selectedCategories = categories.filter(category =>
        teacherData.categoryId.includes(category._id)
      ).map(category => ({
        value: category._id,
        label: category.categoryName
      }));
      setSelectedCategories(selectedCategories);

      // Filter and pre-select courses
      const filtered = allCourses.filter(course =>
        teacherData.categoryId.includes(course.courseCategory)
      );
      setFilteredCourses(filtered);

    } catch (error) {
      console.log(error);
    }
  };

  // Filter courses based on selected categories
  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);

    const selectedCategoryIds = selectedOptions.map(option => option.value);
    const filtered = allCourses.filter(course =>
      selectedCategoryIds.includes(course.courseCategory)
    );

    setFilteredCourses(filtered);
    setFormData(prevData => ({
      ...prevData,
      categoryId: selectedCategoryIds
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      currentlyGivingcourse: selectedIds
    }));
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let updatedFormData = { ...formData };

    if (type === 'file') {
      updatedFormData.teacherImage = event.target.files[0];
      const preview = URL.createObjectURL(event.target.files[0]);  // Create a URL for the image file
      setImagePreview(preview);  // Set the image preview
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
};


  useEffect(() => {
    handleFetchCategory();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && allCourses.length > 0) {
      fetchTeacher();  // Fetch teacher details only after courses and categories are loaded
    }
  }, [categories, allCourses]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('teacherName', formData.teacherName);
    data.append('teacherEmail', formData.teacherEmail);
    data.append('teacherQualification', formData.teacherQualification);
    data.append('teacherExperience', formData.teacherExperience);
    data.append('teacherExpertise', formData.teacherExpertise);

    if (formData.teacherImage) {
      data.append('teacherImage', formData.teacherImage);
    }

    formData.categoryId.forEach(categoryId => {
      data.append('categoryId', categoryId);
    });

    formData.currentlyGivingcourse.forEach(courseId => {
      data.append('currentlyGivingcourse', courseId);
    });

    try {
      const response = await axios.put(`https://www.api.panandacademy.com/api/v1/update-teacher/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false);
      toast.success("Teacher Updated Successfully!");
      navigate('/all-teacher');  // Redirect after update
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      toast.error(error.response?.data?.msg || 'An error occurred');
    }
  };

  // Map categories for react-select
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.categoryName,
  }));

  // Map courses for react-select
  const courseOptions = filteredCourses.map(course => ({
    value: course._id,
    label: course.courseName,
  }));

  return (
    <>
      {/* <ToastContainer /> */}
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>Edit Teacher</h4>
        </div>
        <div className="links">
          <Link to="/all-teacher" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="teacherName" className="form-label">Teacher Name</label>
            <input type="text" onChange={handleChange} name='teacherName' value={formData.teacherName} className="form-control" id="teacherName" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherImage" className="form-label">Teacher Image(600 x 600)</label>
            <input type="file" onChange={handleChange} name='teacherImage' className="form-control" id="teacherImage" />
            {imagePreview && <img src={imagePreview} style={{width:'140px'}} alt="Preview" className="img-fluid mt-2" />}
          </div>

          <div className="col-md-6">
            <label htmlFor="categoryId" className="form-label">Categories</label>
            <Select
              isMulti
              onChange={handleCategoryChange}
              options={categoryOptions}
              value={selectedCategories}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="currentlyGivingcourse" className="form-label">Courses Taught by Teacher</label>
            <Select
              isMulti
              onChange={handleSelectChange}
              options={courseOptions}
              value={formData.currentlyGivingcourse.map(courseId => {
                const course = allCourses.find(course => course._id === courseId);
                return course ? { value: course._id, label: course.courseName } : null;
              })}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? "Please Wait..." : "Update Teacher"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditTeacher;
