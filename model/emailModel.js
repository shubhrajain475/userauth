// models/emailModel.js
let emailQueue = [];

const addEmailToQueue = (email, password) => {
  emailQueue.push({ email, password });
};

const getEmailQueue = () => emailQueue;

const clearEmailQueue = () => {
  emailQueue = [];
};

export { addEmailToQueue, getEmailQueue, clearEmailQueue };


