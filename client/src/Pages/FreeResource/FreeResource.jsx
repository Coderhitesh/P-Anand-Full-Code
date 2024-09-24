import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './freeResource.css'; // Make sure you style your custom CSS
import pdf from './pdf.png'

function FreeResource() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

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
    }, []);

    // Fetch resources when the active category changes
    useEffect(() => {
        if (activeCategory) {
            fetchResources(activeCategory);
        }
    }, [activeCategory]);

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
                                        <div className="card-body ">
                                            <img
                                                src={pdf} // Replace with your PDF image/icon URL
                                                alt="PDF Thumbnail"
                                                className="pdf-image"
                                            />
                                            <div className="card-footer">
                                                <h5 className="card-title">{resource.name}</h5>
                                            </div>
                                            <a href={resource.FreePDF.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
                                                View PDF
                                            </a>
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
        </div>
    );
}

export default FreeResource;
