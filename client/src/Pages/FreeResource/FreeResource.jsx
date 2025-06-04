import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './freeResource.css'; // Make sure you style your custom CSS
import pdf from './pdf.png';

function FreeResource() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        studenClass: "",
        location: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all categories on component mount
    const fetchCategories = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-free-resource-category');
            setCategories(res.data.data);
            if (res.data.data.length > 0) {
                setActiveCategory(res.data.data[0]._id); // Set the first category as active
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch all resources according to the active category
    const fetchResources = async (categoryId) => {
        setLoading(true);
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-free-resource');
            const filteredResources = res.data.data.filter(resource => resource.categoryId === categoryId);
            setResources(filteredResources);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    // Fetch resources when the active category changes
    useEffect(() => {
        if (activeCategory) {
            fetchResources(activeCategory);
        }
    }, [activeCategory]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validate form
    const validateForm = () => {
        let errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.number.trim()) errors.number = "Number is required";
        if (!formData.studenClass.trim()) errors.studenClass = "Class is required";
        if (!formData.location.trim()) errors.location = "Location is required";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await axios.post('https://www.api.panandacademy.com/api/v1/create-download-pdf-detail', formData);
                
                // After successful submission, open the PDF
                window.open(`https://www.api.panandacademy.com/${selectedPdf}`, '_blank');
                
                // Reset form and close modal
                setFormData({
                    name: "",
                    number: "",
                    studenClass: "",
                    location: ""
                });
                setShowForm(false);
                setSelectedPdf(null);
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Failed to submit your details. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Handle PDF click
    const handlePdfClick = (pdfPath) => {
        setSelectedPdf(pdfPath);
        setShowForm(true);
    };

    return (
        <div className='free-resource-section'>
            <div className="container">
                <ul className="nav custom-pill nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                    {categories.map((category) => (
                        <li className="nav-item" key={category._id}>
                            <button
                                className={`nav-link custom-btn ${activeCategory === category._id ? 'active-btn' : ''}`}
                                onClick={() => setActiveCategory(category._id)}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="tab-content" id="pills-tabContent">
                    {loading ? (
                        <p>Loading resources...</p>
                    ) : resources.length > 0 ? (
                        <div className="row">
                            {resources.map((resource) => (
                                <div className="col-md-3 forwidth" key={resource._id}>
                                    <div className="card mb-4 text-center">
                                        <div className="card-body">
                                            <img
                                                src={pdf}
                                                alt="PDF Thumbnail"
                                                className="pdf-image"
                                            />
                                            <div className="card-footer">
                                                <h5 className="card-title">{resource.name}</h5>
                                            </div>
                                            <button 
                                                onClick={() => handlePdfClick(resource.FreePDF)} 
                                                className="btn btn-primary mt-2"
                                            >
                                                View PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No resources available for this category.</p>
                    )}
                </div>
            </div>

            {/* Inquiry Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Please provide your details to view the PDF</h3>
                            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="number">Phone Number</label>
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.number ? 'is-invalid' : ''}`}
                                />
                                {formErrors.number && <div className="invalid-feedback">{formErrors.number}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="studenClass">Class</label>
                                <input
                                    type="text"
                                    id="studenClass"
                                    name="studenClass"
                                    value={formData.studenClass}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.studenClass ? 'is-invalid' : ''}`}
                                />
                                {formErrors.studenClass && <div className="invalid-feedback">{formErrors.studenClass}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.location ? 'is-invalid' : ''}`}
                                />
                                {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
                            </div>
                            <div className="button-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit & View PDF'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FreeResource;