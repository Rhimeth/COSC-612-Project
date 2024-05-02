/* eslint-disable react/prop-types */

import { Box } from '@mui/material';

const colors = [
    '#FF0000', 
    '#FF4500', 
    '#FF8C00', 
    '#FFFF00',
    '#ADFF2F',
    '#00FF00',
    '#008000',
    '#0000FF',
    '#00008B',
    '#4B0082',
    '#8A2BE2',
    '#FF00FF',
    '#EE82EE',
    '#000000',
    '#3F3F3F'
];

const Tag = ({ tag }) => {
    const color = colors[tag.tagId - 1];

    return (
        <Box
            sx={{
                backgroundColor: color,
                color: tag.tagId,
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                marginRight: '8px',
                marginBottom: '8px',
                textAlign: 'center'
            }}
        >
            {tag.name}
        </Box>
    );
};

export default Tag;
