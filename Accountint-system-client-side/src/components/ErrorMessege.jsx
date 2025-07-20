import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';

const ErrorMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        marginTop: "1rem"
      }}>
        <ErrorOutlineIcon sx={{ marginRight: '0.5rem', color: '#D19793' }} />
        <Typography variant="body1">שגיאת מערכת</Typography>
      </Box>
    </motion.div>
  );
};

export default ErrorMessage;
