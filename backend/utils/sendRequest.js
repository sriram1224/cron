const axios = require('axios');

const sendRequest = async (job) => {
  try {
    const options = {
      method: job.method,
      url: job.url,
      headers: job.headers || {},
      timeout: 15000 // 15 seconds timeout
    };

    if (['POST', 'PUT'].includes(job.method) && job.body) {
      options.data = job.body;
      // Ensure Content-Type is set if not present
      if (!options.headers['Content-Type'] && !options.headers['content-type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await axios(options);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response ? error.response.status : 0,
      error: error.message,
      data: error.response ? error.response.data : null
    };
  }
};

module.exports = sendRequest;
