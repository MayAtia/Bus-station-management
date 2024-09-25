export const handleInputChange = (setterFunction) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setterFunction(value);
    } else {
      alert('יש להכניס רק מספרים');
    }
  };