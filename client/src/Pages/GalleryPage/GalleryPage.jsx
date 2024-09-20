import React, { useEffect, useState } from 'react';
import './GalleryPage.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function GalleryPage() {
    const [images, setImages] = useState([]);
    const [galleryNames, setGalleryNames] = useState([]);
    const [groupedImages, setGroupedImages] = useState({});
    const [modalImage, setModalImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(()=>{
        window.scrollTo({
            top:'0',
            behavior:'smooth'
        })
    },[])

    const fetchGalleryName = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-gallery-category-name');
            setGalleryNames(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchImages = async () => {
        try {
            const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-gallery-image');
            setImages(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchGalleryName();
        fetchImages();
    }, []);

    useEffect(() => {
        const grouped = {};
        images.forEach(image => {
            const { galleryCategoryId } = image;
            if (!grouped[galleryCategoryId]) {
                grouped[galleryCategoryId] = [];
            }
            grouped[galleryCategoryId].push(image.image.url);
        });
        setGroupedImages(grouped);
    }, [images]);

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalImage(null);
    };

    return (
        <>
            <div className="gallery-section">
                <div className="gallery-container container">
                    <ul className="nav nav-tabs" id="galleryTab" role="tablist">
                        {galleryNames.map((gallery, index) => (
                            <li className="nav-item" role="presentation" key={gallery._id}>
                                <button
                                    className={`nav-link ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                    aria-controls={`gallery-tab-${index}`}
                                    role="tab"
                                    aria-selected={activeTab === index}
                                >
                                    {gallery.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content" id="galleryTabContent">
                        {galleryNames.map((gallery, index) => (
                            <div
                                className={`tab-pane fade ${activeTab === index ? 'show active' : ''}`}
                                id={`gallery-tab-${index}`}
                                role="tabpanel"
                                key={gallery._id}
                            >
                                <div className="row">
                                    {groupedImages[gallery._id] && groupedImages[gallery._id].map((imageUrl, imageIndex) => (
                                        <div className="column" key={imageIndex}>
                                            <img src={imageUrl} alt={`Gallery ${imageIndex}`} onClick={() => handleImageClick(imageUrl)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Image Preview</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalImage && <img src={modalImage} alt="Preview" className="img-fluid" />}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GalleryPage;
