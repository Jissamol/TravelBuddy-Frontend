import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaChevronRight, FaUserCircle, FaUpload, FaArrowLeft, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const TopNav = styled.div`
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavTitle = styled.h2`
  color: #1e3a8a;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;
  gap: 0.5rem;
  cursor: pointer;
`;

const PageHeader = styled.div`
  background: #ffffff;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e3a8a;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
`;

const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }

  input {
    display: none;
  }
`;

const MasonryGrid = styled.div`
  column-count: 3;
  column-gap: 1.5rem;

  @media (max-width: 1200px) {
    column-count: 2;
  }
  @media (max-width: 768px) {
    column-count: 1;
  }
`;

const ImageItem = styled.div`
  break-inside: avoid;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    display: block;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  ${ImageItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #ef4444;
  }
`;

const FullscreenModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

function MemoryFolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchFolderDetails();
    fetchImages();
  }, [folderId]);

  const fetchFolderDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/travel/memories/folders/${folderId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      if (res.ok) setFolder(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/travel/memories/folders/${folderId}/images/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      if (res.ok) setImages(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const form = new FormData();
      form.append("image", files[i]);

      try {
        await fetch(`http://localhost:8000/api/travel/memories/folders/${folderId}/images/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          body: form
        });
      } catch (err) {
        console.error("Upload failed for file", files[i].name);
      }
    }
    // Refresh after all uploads
    fetchImages();
    fetchFolderDetails();
  };

  const handleDelete = async (e, imageId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/travel/memories/images/${imageId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      if (res.ok) fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <TopNav>
          <HeaderLeft>
            <NavTitle>Travel Buddy</NavTitle>
            <FaChevronRight color="#cbd5e1" size={14} />
            <Breadcrumb onClick={() => navigate("/memories")}>
              <span>Memories</span>
              <FaChevronRight size={12} />
              <span style={{color: "#0f172a", fontWeight: 600}}>{folder ? folder.name : "Loading..."}</span>
            </Breadcrumb>
          </HeaderLeft>
          <div style={{color: "#64748b"}}><FaUserCircle size={28} /></div>
        </TopNav>

        <PageHeader>
          <PageTitle>
            <BackButton onClick={() => navigate("/memories")}><FaArrowLeft size={20} /></BackButton>
            {folder ? folder.name : ""}
          </PageTitle>
          <p style={{color: "#64748b", margin: 0, paddingLeft: "3rem"}}>
            {folder ? folder.description : ""}
          </p>
        </PageHeader>

        <ContentWrapper>
          <UploadZone>
            <FaUpload size={40} style={{ marginBottom: "1rem" }} />
            <h3 style={{ margin: "0 0 0.5rem" }}>Upload Photos</h3>
            <p style={{ margin: 0 }}>Click to browse or drag and drop images here</p>
            <input type="file" multiple accept="image/*" onChange={handleUpload} />
          </UploadZone>

          {images.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
              <h2>No photos yet</h2>
              <p>Upload some photos to start building this memory folder.</p>
            </div>
          ) : (
            <MasonryGrid>
              {images.map(img => (
                <ImageItem key={img.id} onClick={() => setSelectedImage(img.image)}>
                  <img src={img.image} alt={img.caption} />
                  <DeleteBtn onClick={(e) => handleDelete(e, img.id)}><FaTimes /></DeleteBtn>
                </ImageItem>
              ))}
            </MasonryGrid>
          )}
        </ContentWrapper>
      </MainContent>

      {selectedImage && (
        <FullscreenModal onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Fullscreen" style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "8px" }} />
          <button 
            style={{ position: "absolute", top: "2rem", right: "2rem", background: "none", border: "none", color: "white", cursor: "pointer" }}
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes size={32} />
          </button>
        </FullscreenModal>
      )}
    </Container>
  );
}

export default MemoryFolderPage;
