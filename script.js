const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sEspecie = document.querySelector('#m-especie')
const sSexo = document.querySelector('#m-sexo')
const sTutor = document.querySelector('#m-tutor')
const btnSave = document.querySelector('#btnSave')

let itens
let id

// Abrir modal para cadastro.

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sEspecie.value = itens[index].especie
    sSexo.value = itens[index].sexo
    sTutor.value = itens[index].tutor
    id = index
  } else {
    sNome.value = ''
    sEspecie.value = ''
    sSexo.value = ''
    sTutor.value = ''
  }
}

// Editar e deletar entradas.

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

// Inserir dados do cliente.

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.especie}</td>
    <td>${item.sexo}</td>
    <td>${item.tutor}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

// Salvar a entrada.
btnSave.onclick = e => {
  if (
    sNome.value == '' ||
    sEspecie.value == '' ||
    sSexo.value == '' ||
    sTutor.value == ''
  ) {
    return
  }

  e.preventDefault()

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].especie = sEspecie.value
    itens[id].sexo = sSexo.value
    itens[id].tutor = sTutor.value
  } else {
    itens.push({
      nome: sNome.value,
      especie: sEspecie.value,
      sexo: sSexo.value,
      tutor: sTutor.value
    })
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

// Botão para busca pelo nome do pet, espécie ou tutor.
function searchTable() {
  const searchValue = document.querySelector('#search').value.toLowerCase()

  const rows = document.querySelectorAll('tbody tr')

  rows.forEach(row => {
    const cells = row.querySelectorAll('td')

    let matchFound = false

    cells.forEach(cell => {
      const cellText = cell.textContent.toLowerCase()
      if (cellText.includes(searchValue)) {
        matchFound = true
      }
    })

    if (matchFound) {
      row.style.display = ''
    } else {
      row.style.display = 'none'
    }
  })
}

document.querySelector('#search-btn').addEventListener('click', searchTable)

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
