import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllPdfEnquiryDetail = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all enquiry details
  const handleFetch = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-download-pdf-detail');
      setEnquiries(res.data.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  // Delete a specific enquiry
  const handleDelete = async () => {
    try {
      await axios.delete(`https://www.api.panandacademy.com/api/v1/delete-download-pdf-detail/${selectedId}`);
      handleFetch();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(enquiries.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">All PDF Enquiry Details</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Class</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((entry, index) => (
            <tr key={entry._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.number}</td>
              <td>{entry.studenClass}</td>
              <td>{entry.location}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedId(entry._id);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Page {currentPage} of {totalPages}</span>
        <div>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Enquiry</h5>
              <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this enquiry?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPdfEnquiryDetail;
