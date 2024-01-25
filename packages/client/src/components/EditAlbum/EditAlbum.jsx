import React from 'react'

function EditAlbum({ album, onSave }) {
    const [formData, setFormData] = useState({ ...album });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(album._id, formData);
    };
    const handleFormSubmit = async (albumId, updatedData) => {
        try {
          const response = await api.put(`/albums/${albumId}`, updatedData);
          // Handle success (e.g., show a success message, update the state)
        } catch (error) {
          // Handle error (e.g., show an error message)
        }
      };
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Album Title</Form.Label>
          <Form.Control 
            type="text" 
            name="albumTitle" 
            value={formData.albumTitle} 
            onChange={handleChange} 
          />
        </Form.Group>
        {/* Add other fields (releaseYear, artistName, etc.) */}
        <Button type="submit">Save Changes</Button>
      </Form>
    );
  };


export default EditAlbum