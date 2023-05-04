export default class SortableTable {
  element;
  subElement;
  isSortLocally;
  defaultField;
  defaultOrder;
    constructor(headerConfig = [], {data = [], sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }} = {}, isSortLocally = 'true', defaultField = 'title', defaultOrder = 'asc') {
      this.headerConfig = headerConfig;
      this.data = data;
      this.isSortLocally = isSortLocally;
      this.defaultField = defaultField;
      this.defaultOrder = defaultOrder;
      this.sorted = sorted;
      this.render();
      
      //this.sort(defaultField,defaultOrder);
    }
  
    render() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTable();
  
      this.element = wrapper.firstElementChild;
      this.subElement = this.getSubElement(this.element);
      this.setEventListener();
    }
  
    onSortClick = event => {
      const column = event.target.closest('[data-sortable="true"]');

      const orderChange = order => {
        const orders = {
          asc : "desc",
          desc : "asc",
        };
        return orders[order];
      };

      if (column) {
        const {id , order} = column.dataset;
        const newOrder = orderChange(order);
        const sortedData = this.sortData(id , newOrder);

        const arrow = column.querySelector('.sortable-table__sort-arrow');

        column.dataset.order = newOrder;

        if (!arrow) {
          column.append(this.subElement.arrow);
        }
        this.subElement.body.innerHTML = this.getTableRows(sortedData);
      }
    }

    sort(field, order) {
      if (this.isSortLocally) {
        this.sortOnClient(field, order);
      } else {
        this.sortOnServer(field, order);
      }
    }
  
  sortOnClient(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
  
    allColumns.forEach(column => {
      column.dataset.order = '';
    });
  
    currentColumn.dataset.order = order;
  
    this.subElement.body.innerHTML = this.getTableRows(sortedData);
  
  
  }
  
  sortOnServer(field, order) {
    console.log('Загрука отсортированных данных с сервера...');
    this.sortOnClient(field, order);
  }
  
  setEventListener() {
    this.subElement.header.addEventListener('pointerdown', this.onSortClick)
  }
  
  
  getSubElement(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
  
    for (const subElem of elements) {
      const name = subElem.dataset.element;
  
      result[name] = subElem;
    }
  
    return result;
  }
  
  getTableHeader(){
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
    ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`
  }
  
  getHeaderRow({id, title, sortable}) {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="asc">
    <span>${title}</span>
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
  </div>`
  }
  
   getTableBody(){
    return `<div data-element="body" class="sortable-table__body">
    ${this.getTableRows(this.data)}
    </div>`
   }
  
   getTableRows(data = []) {
    return data.map(item => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
      ${this.getTableRow(item)}
      </a>`;
    }).join('');
   }
  
   getTableRow(item) {
    const cells = this.headerConfig.map(({id , template}) => {
      return {
        id,
        template
      }
    })
  
    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class='sortable-table__cell'>${item[id]}</div>`
    }).join('');
   }
  
   getTable() {
      return `
      <div class="sortable-table">
      ${this.getTableHeader()}
      ${this.getTableBody()}
      </div>
      `
   }
  
   sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc : -1
    }
    const direction = directions[order];
  
    return arr.sort((a,b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string' :
          return direction * a[field].localeCompare(b[field], ['ru' , 'en']);
        case 'custom' :
          return direction * customSorting(a,b);
        default :
          throw new Error (`Unknown type ${sortType}`);   
      }
    });
   }
  
    remove() {
       if(this.element) {
        this.element.remove();
       }
    }
  
    destroy() {
      this.remove();
      this.element = {};
      this.subElement = {};
    }
  }
  
  

