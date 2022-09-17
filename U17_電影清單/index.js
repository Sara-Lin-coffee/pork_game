//const
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = []

const dataPanel = document.querySelector('#data-panel')
const modal = document.querySelector('.modal-content')
const searchForm = document.querySelector('#search-form')
const inputValue = document.querySelector('#inlineFormInputGroupUsername')


// function (將API data寫進HTML裡面)
function renderFriendList(data){
  let rawHTML = ''
  
  data.forEach((item)=>{
    rawHTML +=`
    <div class="friend-card mt-5" style="width: 18rem;">
      <img
        src= "${item.avatar}"
        class="card-img-top" alt="...">
      <div class="friend-body">
      <h5 class="friend-title">${item.name + item.surname}</h5>
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id = "${item.id}">More
        </button>
      </div>
    </div>
    `
  })
  
  dataPanel.innerHTML = rawHTML
}


// get index data
axios.get(INDEX_URL).then((response) => {
  friends.push(...response.data.results)
  renderFriendList(friends)
  })


//function to replace modal HTML
function showFriendModal(id){
  const friendTitle = document.querySelector('#friend-modal-title')
  const friendImage = document.querySelector('#friend-modal-image')
  const friendDate = document.querySelector('#friend-modal-date')
  const friendDescription = document.querySelector('#friend-modal-description')

  axios.get(INDEX_URL+id).then((response) =>{
    console.log(response)
    const data = response.data
    friendTitle.innerText = data.name + data.surname
    friendDate.innerText = `Birthday: ${data.birthday}`
    friendDescription.innerText = `Gender: ${data.gender}; Age: ${data.age}; Region: ${data.region}`
    //為甚麼沒辦法斷行QQ
    //<p id="friend-modal-description">Gender: ${data.gender}; <br> Age: ${data.age};</br><br> Region: ${data.region}</br></p>
    
    friendImage.innerHTML = `<img src="${data.avatar}" alt="friend-poster" class="image-fluid">`
  })
}


// 監聽器 for button "more"
dataPanel.addEventListener('click', function openModal(event){
  if (event.target.matches('.btn-show-movie')){
    showFriendModal(Number(event.target.dataset.id))
}
})

// 監聽器 for button "submit" 
searchForm.addEventListener('click', function onSubmitButton(event){
  event.preventDefault() 
  
  const keyword = inputValue.value.trim().toLowerCase()
  if (!keyword.length){
    return alert('Please enter valid string.')
  }

  let filterFriends = []
  
  filterFriends = friends.filter((friend)=>((friend.name.toLowerCase().includes(keyword)) || (friend.surname.toLowerCase().includes(keyword))))
  
  //為甚麼FilterFriends是空的，畫面就不會改變呀?
  if (filterFriends.length === 0){
    alert(`not found name includes '${keyword}'`)
  } 

  //回傳到畫面
  renderFriendList(filterFriends)
})