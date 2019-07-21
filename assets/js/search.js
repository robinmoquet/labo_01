const initEventListener = () => {
    const inputSearch = document.getElementById("search-user");
    inputSearch.addEventListener("keyup", handleKeyDownSearch);
};

const handleKeyDownSearch = event => {
    const value = event.target.value;
    filterUser(value);
};

const filterUser = value => {
    const users = document.querySelectorAll(".sidebar .user");

    users.forEach(user => {
        const userName = user.querySelector("h3").innerText.toLowerCase();
        if(!userName.startsWith(value.toLowerCase())) user.classList.add('hidden');
        else user.classList.remove('hidden');
    })
};

filterUser("");
initEventListener();