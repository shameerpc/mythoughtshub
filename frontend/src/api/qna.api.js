import api from "./axios";

// Fetch Q&A for a blog post
export const getQuestionsApi = async (blogId) => {
  const response = await api.get(`/api/qna/${blogId}/questions`);
  return response.data;
};

// Ask a new question on a blog post
export const askQuestionApi = async (blogId, data) => {
  const response = await api.post(`/api/qna/${blogId}/questions`, data);
  return response.data;
};

// Submit an answer to an existing question
export const answerQuestionApi = async (questionId, data) => {
  const response = await api.post(`/api/qna/questions/${questionId}/answers`, data);
  return response.data;
};

// Upvote (or toggle upvote) on a specific answer
export const upvoteAnswerApi = async (questionId, answerId) => {
  const response = await api.post(`/api/qna/questions/${questionId}/answers/${answerId}/upvote`);
  return response.data;
};
