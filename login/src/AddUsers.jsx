import React, { useEffect, useState } from "react";
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

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
};

const AddUsers = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM);
      setFormError("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      if (typeof onSubmit === "function") {
        await onSubmit(formData);
      }

      setFormData(INITIAL_FORM);

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add user.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="add-user-dialog">
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New User
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minWidth: 400 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              disabled={isSubmitting}
               InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
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

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
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

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              disabled={isSubmitting}
             InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
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

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            <TextField
              name="role"
              label="Role"
              value={formData.role}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              disabled={isSubmitting}
            InputProps={{
                  sx: {
                    borderRadius: '12px',
                    height: '55px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffcc00',
                    borderWidth: '2px',
                    '& input::placeholder': {
                    padding: '16px 14px',
                    color: 'gray',       
                    opacity: 1,  
                           
                  },
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

                  InputLabelProps={{
                sx: {
                '&.Mui-focused': {
                    color: '#facc15', 
                },
                },
            }}
            />
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#facc15",
                height: "50px",
                color: "#000",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#fbbf24" },
              }}
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AddUsers;
