exports.lowDash = (inputString) => {

    inputString = inputString.replace(/[^\w\s]/gi, '');
    const results = [];
    const len = inputString.length;
        
    
        for(i=0; i<len; i++) {
    
            if(inputString[i] == " "){            
                if(inputString[i-1] !== " " && i !== 0 && i !== len-1) {
                    results.push("-");          
                }            
            } else { 
                results.push(inputString[i].toLowerCase());
            }
        }
        return results.join("");
}



exports.getDate = function() {

    const today = new Date();
  
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    };
  
    return today.toLocaleDateString("en-US", options);
  
};
  
exports.getDay = function () {
  
    const today = new Date();
  
    const options = {
      weekday: "long"
    };
  
    return today.toLocaleDateString("en-US", options);
  
  };