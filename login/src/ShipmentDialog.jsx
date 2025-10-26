import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";  

const ShipmentDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    mmsi: "",
    bol: "",
    id: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.mmsi || !formData.bol || !formData.id || !formData.time) {
      alert("Please fill in all fields.");
      return;
    }

    onSubmit(formData);
    onClose();
    setFormData({ mmsi: "", bol: "", id: "", time: "" }); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="add-shipment-dialog">  
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New Shipment
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minWidth: 400}}>
          <Box display="flex" flexDirection="column" gap={.5}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ship MMSI
              </Typography>
              <TextField
                name="mmsi"
                value={formData.mmsi}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: "50px",
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffcc00',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Bill of Lading (BOL)
              </Typography>
              <TextField
                name="bol"
                value={formData.bol}
                onChange={handleChange}
                variant="outlined"
                 InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: "50px",
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffcc00',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ship ID
              </Typography>
              <TextField
                name="id"
                value={formData.id}
                onChange={handleChange}
                variant="outlined"
                 InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: "50px",
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffcc00',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Time
              </Typography>
              <TextField
                name="time"
                type="date"
                value={formData.time}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                 InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: "50px",
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffcc00',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#facc15',
                    },
                  },
                }}
                fullWidth
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: "10px",
                backgroundColor: "#facc15",
                color: "#000",
                fontWeight: 600,
                padding: "12px",
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#fbbf24" },
              }}
              onClick={handleSubmit}
            >
              Add Shipment
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ShipmentDialog;
