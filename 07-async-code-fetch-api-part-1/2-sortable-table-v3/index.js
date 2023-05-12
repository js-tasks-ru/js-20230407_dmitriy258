import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements;
  isSortLocally;
  defaultField;
  defaultOrder;
  data = [];
  loading = false;
  step =  20;
  start = 0;
  end = this.start + this.step;


    constructor(headerConfig = [], {
      data = [], 
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: 'asc'
      },
      isSortLocally = false,
      defaultField = 'title',
      defaultOrder = 'asc',
      url = '',
      start = 0,
      step = 20,
      end = start + step,
  } = {}, ) {
      this.headerConfig = headerConfig;
      this.data = data;
      this.url = new URL(url,BACKEND_URL);
      this.start = start;
      this.end = end;
      this.step = step;
      this.isSortLocally = isSortLocally;
      this.defaultField = defaultField;
      this.defaultOrder = defaultOrder;
      this.sorted = sorted;
      this.render();
      
      //this.sort(defaultField,defaultOrder);
    }
  
    infScroll = async() => {
      const {bottom} = this.element.getBoundingClientRect();
      const {id, order} = this.sorted;

      if (bottom < document.documentElement.clientHeight && !this.loading) {
        this.start = this.end;
        this.end = this.start + this.step;

        this.loading = true;

        const data = await this.loadData(id, order, this.start, this.end);

        this.update(data); 

        this.loading = false;
      }
    }
     
   async render() {
    const {id, order} = this.sorted;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTable();
  
      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElement(this.element);
      const data = await this.loadData(id,order,this.start, this.end);

      this.renderRows(data);
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
        this.subElements.body.innerHTML = this.getTableRows(sortedData);
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
  
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  
  
  }
  
  async sortOnServer(field, order) {
    const start = 0; 
    const end = start + this.step;

    const data = await this.loadData(field,order,start,end);

    this.renderRows(data);
  }
  update(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  renderRows(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
     this.data = data;
     this.subElements.body.innerHTML = this.getTableRows(data);
    }
    else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  async loadData (...props) {
    const data = await this.load(...props);

    return data;
  }

  async load (field,order,start = this.start, end = this.end) {
    this.url.searchParams.set('_sort',field);
    this.url.searchParams.set('_order',order);
    this.url.searchParams.set('_start',start);
    this.url.searchParams.set('_end',end);

    return await fetchJson(this.url)
  }
  
  setEventListener() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick)

    if (!this.isSortLocally) {
      document.addEventListener('scroll', this.infScroll);
    }
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
      this.subElements = {};
    }
  }
  
  


