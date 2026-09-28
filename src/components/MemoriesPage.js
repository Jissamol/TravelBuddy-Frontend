import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaChevronRight, FaUserCircle, FaFolder, FaPlus } from "react-icons/fa";
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
`;

const ContentWrapper = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const FolderCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const FolderImage = styled.div`
  height: 160px;
  background-color: #e2e8f0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FolderInfo = styled.div`
  padding: 1.5rem;
`;

const FolderName = styled.h3`
  margin: 0 0 0.5rem;
  color: #0f172a;
  font-size: 1.2rem;
`;

const FolderDesc = styled.p`
  margin: 0 0 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
`;

const CreateCard = styled(FolderCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  background: transparent;
  box-shadow: none;
  min-height: 250px;
  color: #64748b;

  &:hover {
    background: #f8fafc;
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
`;

const Button = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
`;

function MemoriesPage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/travel/memories/folders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFolders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;

    try {
      const res = await fetch("http://localhost:8000/api/travel/memories/folders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        },
        body: JSON.stringify({ name: newFolderName, description: newFolderDesc })
      });
      if (res.ok) {
        setShowModal(false);
        setNewFolderName("");
        setNewFolderDesc("");
        fetchFolders();
      }
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
            <Breadcrumb>
              <span>Dashboard</span>
              <FaChevronRight size={12} />
              <span className="active" style={{color: "#0f172a", fontWeight: 600}}>Memories</span>
            </Breadcrumb>
          </HeaderLeft>
          <div style={{color: "#64748b"}}><FaUserCircle size={28} /></div>
        </TopNav>

        <PageHeader>
          <PageTitle>Travel Memories</PageTitle>
          <p style={{color: "#64748b", margin: 0}}>Organize and cherish photos from your trips.</p>
        </PageHeader>

        <ContentWrapper>
          <Grid>
            <CreateCard onClick={() => setShowModal(true)}>
              <FaPlus size={32} style={{ marginBottom: "1rem" }} />
              <h3>New Folder</h3>
            </CreateCard>

            {folders.map(folder => (
              <FolderCard key={folder.id} onClick={() => navigate(`/memories/${folder.id}`)}>
                <FolderImage src={folder.preview_image}>
                  {!folder.preview_image && <FaFolder size={48} color="#94a3b8" />}
                </FolderImage>
                <FolderInfo>
                  <FolderName>{folder.name}</FolderName>
                  <FolderDesc>{folder.description || "No description"}</FolderDesc>
                  <span style={{ fontSize: "0.85rem", color: "#3b82f6", fontWeight: "600" }}>
                    {folder.images_count} Photos
                  </span>
                </FolderInfo>
              </FolderCard>
            ))}
          </Grid>
        </ContentWrapper>
      </MainContent>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{marginTop: 0}}>Create Folder</h2>
            <form onSubmit={handleCreateFolder}>
              <Input 
                type="text" 
                placeholder="Folder Name (e.g. Paris 2024)" 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                required 
              />
              <Input 
                type="text" 
                placeholder="Description (optional)" 
                value={newFolderDesc}
                onChange={e => setNewFolderDesc(e.target.value)}
              />
              <Button type="submit">Create</Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default MemoriesPage;
