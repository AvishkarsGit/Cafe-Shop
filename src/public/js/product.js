const deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener("click",async (e)=>{
      e.preventDefault();
      axios.get("/")
});