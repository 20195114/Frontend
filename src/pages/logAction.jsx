import React from 'react';
import axios from 'axios';

function logAction() {
  const handleButtonClick = async () => {
    const logData = {
      timestamp: new Date().toISOString(),
      action: 'button_click',
      userId: 'user123'
    };

    // 서버로 로그 데이터 전송
    try {
      const response = await axios.post('', logData);
      console.log('Log data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending log data:', error);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click Me</button>
    </div>
  );
}

export default logAction;
