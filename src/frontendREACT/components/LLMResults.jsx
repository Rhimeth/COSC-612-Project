import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import PropTypes from "prop-types";
import AssistantIcon from "@mui/icons-material/Assistant";

function LLMResults({ llmResults }) {
  if (!llmResults) {
    return (
      <Typography variant="h6" style={{ margin: 20 }}>
        Describe to the LLM what kind of recipe you are looking for.
      </Typography>
    );
  }

  return (
    <Box className="llm-results-content" mt={2}>
  <Card style={{ maxWidth: 700, backgroundColor: '#f5f5f5' }}>
    <CardContent>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <Avatar>
          <AssistantIcon />
        </Avatar>
        <Typography variant="h6" component="div" style={{ marginLeft: 10 }}>
          Culinary Helper
        </Typography>
      </Box>
      <Typography variant="body1" component="p">
        {llmResults?.content
          ? llmResults.content.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))
          : "No content available."}
      </Typography>
    </CardContent>
  </Card>
</Box>
  );
}

LLMResults.propTypes = {
  llmResults: PropTypes.shape({
    role: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default LLMResults;
