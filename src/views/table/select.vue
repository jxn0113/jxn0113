handleSelect (a, selectList, currentSelect) {
      if (currentSelect) {
        if (selectList.includes(currentSelect)) {
          this.defaultData.tableDataSelectList.push(currentSelect)
        }
        else {
          this.defaultData.tableDataSelectList = this.defaultData.tableDataSelectList.filter(item => item
            .id != currentSelect.id)
        };
      }
      else {
        const data = this.rowItemTable.getFullData().map(i => i.id);
        this.defaultData.tableDataSelectList = this.defaultData.tableDataSelectList.filter(item => !data
          .includes(item.id));
        if (selectList.length > 0) {
          this.defaultData.tableDataSelectList.push(...selectList);
        }
      }
    },
    //获取表格数据
    async getData (pageObj = {}) {
      let result = (await this.$axios.post('/api/srm/supplier/basic_info/page_for_business', {
        ...this.pageData.form,
        pageNum: pageObj.page.pageNum,
        pageSize: pageObj.page.pageSize,
      })).data.data;
      this.tableDefaultSelect(result)
      return result
    },
    tableDefaultSelect (data) {
      let result = data.list
      let rows = [];
      if (JSON.stringify(this.defaultData.tableDataSelectList) !== '[]') {
        let arr = this.defaultData.tableDataSelectList;
        for (let i in arr) {
          if (result.findIndex(x => x.id === arr[i].id) >= 0) {
            rows.push(result.findIndex(x => x.id === arr[i].id));
          }
        }
        setTimeout(() => {
          if (rows) {
            rows.forEach(row => {
              this.rowItemTable.toggleRowSelection(result[row], true);
            })
          }
        }, 0)
      }
    },