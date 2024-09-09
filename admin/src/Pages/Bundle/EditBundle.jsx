import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';
import Select from 'react-select';

const EditBundle = () => {
  const { id } = useParams(); // Get the bundle ID from the URL params
  const navigate = useNavigate();
  const editor = useRef(null);
  const [allTag, setAllTag] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  // const [filteredCourses, setFilteredCourses] = useState([]);
  // console.log(courses)
  const [formData, setFormData] = useState({
    bundleName: '',
    bundleStartingPrice: '',
    bundleEndingPrice: '',
    bundleDescription: '',
    bundleMode: [],
    bundleImage: null,
    tag: [],
    categoryId: null,
    courses: []
  });

  useEffect(() => {
    // Fetch the bundle data
    const fetchBundleData = async () => {
      try {
        const res = await axios.get(`https://www.api.panandacademy.com/api/v1/single-bundle/${id}`);
        const bundle = res.data.data;
        setFormData({
          ...formData,
          bundleName: bundle.bundleName,
          bundleStartingPrice: bundle.bundleStartingPrice,
          bundleEndingPrice: bundle.bundleEndingPrice,
          bundleDescription: bundle.bundleDescription,
          bundleMode: bundle.bundleMode,
          bundleImage: bundle.bundleImage,
          tag: bundle.tag,
          categoryId: bundle.categoryId,
          courses: bundle.courses
        });
        setImagePreview(bundle.bundleImage.url);
      } catch (error) {
        console.error('Error fetching bundle data:', error);
        toast.error('Failed to fetch bundle data.');
      }
    };

    fetchBundleData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsResponse, categoriesResponse, coursesResponse] = await Promise.all([
          axios.get('https://www.api.panandacademy.com/api/v1/get-all-tag'),
          axios.get('https://www.api.panandacademy.com/api/v1/get-all-category'),
          axios.get('https://www.api.panandacademy.com/api/v1/get-all-course')
        ]);

        setAllTag(tagsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
        setCourses(coursesResponse.data.data || []);

        // Filter courses based on the default or selected category
        // const selectedCategory = formData.categoryId || categoriesResponse.data.data[0]?._id;
        // if (selectedCategory) {
        //   setFilteredCourses(coursesResponse.data.data.filter(course => course.categoryId === selectedCategory) || []);
        // }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data.');
      }
    };

    fetchData();
  }, [formData.categoryId]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagChange = (selectedTags) => {
    setFormData({
      ...formData,
      tag: selectedTags
    });
  };

  const handleCategoryChange = async(selectedCategory) => {
    setFormData({
      ...formData,
      categoryId: selectedCategory ? selectedCategory.value : null
    });

    if(selectedCategory) {
    try {
      const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-courses-by-category/${selectedCategory}`);
        console.log(res.data.data)
        setFilteredCourses(res.data.data);
    } catch (error) {
      console.log(error)
    }
    }
  };

  const handleCoursesChange = (selectedCourses) => {
    
    setFormData({
      ...formData,
      courses: selectedCourses
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setFormData({
      ...formData,
      bundleImage: file
    });
  };

  // Add a new bundle mode
  const addBundleMode = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: [...prevFormData.bundleMode, { modeType: 'Live', coursePrice: '', coursePriceAfterDiscount: '', courseDiscountPercent: '', courseLink: '' }]
    }));
  };

  // Remove a bundle mode
  const removeBundleMode = (index) => {
    const updatedBundleMode = [...formData.bundleMode];
    updatedBundleMode.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: updatedBundleMode
    }));
  };

  const handleBundleModeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBundleMode = [...formData.bundleMode];
    updatedBundleMode[index] = {
      ...updatedBundleMode[index],
      [name]: value
    };

    // Calculate the discounted price when price or discount percent changes
    if (name === 'coursePrice' || name === 'courseDiscountPercent') {
      const price = parseFloat(updatedBundleMode[index].coursePrice) || 0;
      const discountPercent = parseFloat(updatedBundleMode[index].courseDiscountPercent) || 0;
      updatedBundleMode[index].coursePriceAfterDiscount = calculateDiscountedPrice(price, discountPercent);
    }

    if (name === 'modeType' && value !== 'Google Drive') {
      updatedBundleMode[index].courseLink = '';
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: updatedBundleMode
    }));
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    return (price - (price * (discountPercent / 100))).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'tag' || key === 'courses') {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key === 'bundleMode') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.put(`https://www.api.panandacademy.com/api/v1/update-bundle/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Bundle updated successfully.');
      navigate('/all-bundle'); // Redirect to the bundles list or details page
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle.');
    }
  };
  const getCategoryNameById = (categoryId) => {
    const foundCategory = courses.find(cat => cat._id === categoryId);
    return foundCategory ? foundCategory.courseName : "No Category";
};

  return (
    <div className="container mx-auto p-4">
      <div className="bread">
        <div className="head">
          <h4>Edit Course Bundle</h4>
        </div>
        <div className="links">
          <Link to="/all-bundle" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryId" className="form-label">Category</label>
            {categories.length > 0 && (
              <Select
                id="categoryId"
                name="categoryId"
                className="basic-single"
                classNamePrefix="select"
                onChange={handleCategoryChange}
                value={categories.find(cat => cat._id === formData.categoryId) ? { value: formData.categoryId, label: categories.find(cat => cat._id === formData.categoryId).categoryName } : null}
                options={categories.map(cat => ({ value: cat._id, label: cat.categoryName }))}
              />
            )}

          </div>
          <div className="col-md-6">
            <label htmlFor="tag" className="form-label">Tag</label>
            <select
              className="form-select"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleTagChange}
            >
              <option value="">Select Tag</option>
              {
                allTag && allTag.map((item, index) => (
                  <option key={index} value={item._id}>{item.tagName}</option>
                ))
              }
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleName" className="form-label">Bundle Name</label>
            <input
              type="text"
              className="form-control"
              id="bundleName"
              name="bundleName"
              value={formData.bundleName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleStartingPrice" className="form-label">Bundle Starting Price</label>
            <input
              type="number"
              className="form-control"
              id="bundleStartingPrice"
              name="bundleStartingPrice"
              value={formData.bundleStartingPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleEndingPrice" className="form-label">Bundle Ending Price</label>
            <input
              type="number"
              className="form-control"
              id="bundleEndingPrice"
              name="bundleEndingPrice"
              value={formData.bundleEndingPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleImage" className="form-label">Bundle Image</label>
            <input

              className="form-control"
              type="file"
              id="bundleImage"
              name="bundleImage"
              accept="image/*"
              onChange={handleImageChange}

            />
            {imagePreview && <img style={{ width: '80px', height: '80px' }} src={imagePreview} alt="Bundle Preview" className="img-preview mt-2" />}
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleCourseId" className="form-label">Select Courses</label>
            <Select
  isMulti
  name="courses"
  options={filteredCourses.map(course => ({ value: course._id, label: course.courseName }))}
  className="basic-multi-select"
  classNamePrefix="select"
  onChange={handleCoursesChange}
  value={filteredCourses.filter(course => formData.courses.includes(course._id)).map(course => ({ value: course._id, label: course.courseName }))}
/>

          </div>

          {formData.bundleMode.map((mode, index) => (
            <div key={index} className="bundle-mode">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor={`modeType-${index}`} className="form-label">Mode Type</label>
                  <select
                    id={`modeType-${index}`}
                    name="modeType"
                    className="form-select"
                    value={mode.modeType}
                    onChange={(e) => handleBundleModeChange(index, e)}
                  >
                    <option value="Live">Live</option>
                    <option value="Recorded">Recorded</option>
                    <option value="Google Drive">Google Drive</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                {mode.modeType !== 'Google Drive' && (
                  <>
                    <div className="col-md-6">
                      <label htmlFor={`coursePrice-${index}`} className="form-label">Course Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePrice-${index}`}
                        name="coursePrice"
                        value={mode.coursePrice}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`coursePriceAfterDiscount-${index}`} className="form-label">Course Price After Discount</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePriceAfterDiscount-${index}`}
                        name="coursePriceAfterDiscount"
                        value={mode.coursePriceAfterDiscount}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseDiscountPercent-${index}`} className="form-label">Course Discount Percent</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`courseDiscountPercent-${index}`}
                        name="courseDiscountPercent"
                        value={mode.courseDiscountPercent}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                  </>
                )}
                {mode.modeType === 'Google Drive' && (

                  <>
                    <div className="col-md-6">
                      <label htmlFor={`coursePrice-${index}`} className="form-label">Course Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePrice-${index}`}
                        name="coursePrice"
                        value={mode.coursePrice}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`coursePriceAfterDiscount-${index}`} className="form-label">Course Price After Discount</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePriceAfterDiscount-${index}`}
                        name="coursePriceAfterDiscount"
                        value={mode.coursePriceAfterDiscount}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseDiscountPercent-${index}`} className="form-label">Course Discount Percent</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`courseDiscountPercent-${index}`}
                        name="courseDiscountPercent"
                        value={mode.courseDiscountPercent}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseLink-${index}`} className="form-label">Course Link</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`courseLink-${index}`}
                        name="courseLink"
                        value={mode.courseLink}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                  </>


                )}
                <div className="col-md-12 mt-3">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeBundleMode(index)}
                  >
                    Remove Mode
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="col-md-12 mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={addBundleMode}
            >
              Add Mode
            </button>
          </div>

          <div className="col-md-12 mt-3">
            <label htmlFor="bundleDescription" className="form-label">Bundle Description</label>
            <JoditEditor
              ref={editor}
              value={formData.bundleDescription}
              onChange={(newContent) => setFormData({ ...formData, bundleDescription: newContent })}
              className="border border-gray-300 rounded-md"

            />
          </div>

          <div className="col-md-12 mt-3">
            <label className="form-check-label">
              <input
                type="checkbox"
                name="feature"
                checked={formData.feature}
                onChange={handleChange}
              />
              Feature this bundle
            </label>
          </div>

          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Update Bundle
            </button>

          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditBundle;
