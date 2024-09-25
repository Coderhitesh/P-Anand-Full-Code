import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function AddTeacher() {
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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all categories
  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-course');
      setAllCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter courses based on selected categories
  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);

    // Get selected category IDs
    const selectedCategoryIds = selectedOptions.map(option => option.value);

    // Filter courses that match any of the selected category IDs
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
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  useEffect(() => {
    handleFetchCategory();
    fetchCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('teacherName', formData.teacherName);
    data.append('teacherEmail', formData.teacherEmail);
    data.append('teacherQualification', formData.teacherQualification);
    data.append('teacherExperience', formData.teacherExperience);
    data.append('teacherExpertise', formData.teacherExpertise);
    data.append('teacherImage', formData.teacherImage);

    formData.categoryId.forEach(categoryId => {
      data.append('categoryId', categoryId);
    });

    formData.currentlyGivingcourse.forEach(courseId => {
      data.append('currentlyGivingcourse', courseId);
    });

    try {
      const response = await axios.post('https://api.panandacademy.com/api/v1/create-teacher', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false);
      toast.success("Teacher Added Successfully !!");
      window.location.href = '/all-teacher';
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
          <h4>Add Teacher</h4>
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
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? "Please Wait..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTeacher;
