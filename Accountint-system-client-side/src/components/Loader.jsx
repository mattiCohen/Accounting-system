import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
        color: 'black'
      }}>
        <CircularProgress style={{ color: '#D19793' }} />
      </Box>
    </motion.div>
  );
};

export default Loader;
