function render(datas) {
    let d = document.getElementById('container');
    let dd = datas;
    datas = cal(datas);
    Object.keys(datas).forEach(key => {
        console.log(key, datas[key]);
        d.innerHTML += `
        <div class="list">
            <div class='key'>${key}</div>
            <progress max="100" value="${datas[key]}"> 70% </progress>
            <div class='value'>${dd[key]}次</div>
        </div>
        `
    });

}

function cal(obj) {
    const values = Object.values(obj);
    const maxValue = Math.max(...values);
    if (maxValue === 0) {
        return Object.fromEntries(Object.keys(obj).map(key => [key, 0]));
    }
    const normalizedObj = {};
    for (const [key, value] of Object.entries(obj)) {
        normalizedObj[key] = (value / maxValue) * 100;
    }

    const sortedEntries = Object.entries(normalizedObj).sort((a, b) => b[1] - a[1]);
    const sortedObj = Object.fromEntries(sortedEntries);

    return sortedObj;
}



function getdata() {
    fetch('/AllCount')
    // fetch('http://localhost:3000/AllCount')
        .then(response => response.json())
        .then(res => {
            console.log(res);
            render(res);
        })
        .catch(error => console.error('Error:', error));
}
getdata();
