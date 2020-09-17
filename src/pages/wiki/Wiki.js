import React from "react";
import './Wiki.css'
import ListWiki from './listWiki'
import Content from './content'
import {
  Col, Container, Row
} from "reactstrap";
import Notification from '../../components/Notification'
const api = require("./api/WikiApi");
const utils = require("./../../utils/utils")

class Wiki extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      wikiName: "",
      description: null,
      history: [],
      listWiki: [],
      listFile: [],
      isOpenUpload: false,
      isLoadMore: false,
      openDes: false,
      isLoad: true,
      isLoadListWiki: true,
      isLoadHis: true,
      isLoadFile: false,
      idWiki: null,
      percentage: 0,
      firstWiki: null
    })
    // this.AddFile = this.AddFile.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.getWikiHistory = this.getWikiHistory.bind(this);
    this.getTimeline = this.getTimeline.bind(this);
    this.CreateWiki = this.CreateWiki.bind(this);
    this.DeleteWiki = this.DeleteWiki.bind(this);
    this.EditWiki = this.EditWiki.bind(this);
    this.getWikiHistory = this.getWikiHistory.bind(this);
    this.getListAttachments = this.getListAttachments.bind(this);
    this.DeleteFile = this.DeleteFile.bind(this);
    this.getWiki = this.getWiki.bind(this);


  }
  // Lấy danh sách các Wiki
  getTimeline() {
    this.setState({ isLoad: true, isLoadListWiki: true, isLoadHis: true, isLoadFile: false, });
    api.getTimeline((err, result) => {
      if (err) {
        this.setState({ isLoad: false, isLoadHis: false, isLoadFile: false });
        Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
        return;
      } else {
        this.setState({
          listWiki: result, isLoad: false, isLoadListWiki: false, isLoadHis: false, isLoadFile: false, firstWiki: result[0]
        })
        if (this.state.listWiki.length !== 0) {
          this.getWiki(this.state.listWiki[0].id)
        }

      }
    })

  }

  //Tạo Một Wiki mới
  CreateWiki(e) {
    this.setState({ isLoadListWiki: true });
    api.CreateWiki(e, (err, result) => {
      if (err) {
        this.setState({ isLoad: false });
        Notification("error", "Delete", err)
        return;
      } else {
        var listWiki = utils.copyState(this.state.listWiki)
        listWiki.push(result)
        this.setState({ isLoadListWiki: false, listWiki: listWiki, firstWiki: result });
        this.getWiki(result.id)
      }
    })
  }

  // Xoa Wiki
  DeleteWiki(e, item) {
    console.log(item)
    this.setState({ isLoadListWiki: true });
    if (item.owner.id === JSON.parse(localStorage.getItem('userInfo')).id) {
      api.DeleteWiki(e, (err, result) => {
        if (err) {

          Notification("error", "Delete", err)
        }
        else {

          var listWiki = utils.copyState(this.state.listWiki)
          var index = this.state.listWiki.indexOf(item)
          listWiki.splice(index, 1)
          this.setState({
            openDes: false,
            listFile: [],
            history: [],
            wikiName: '',
            listWiki: listWiki,
            isLoadMore: false,
            isLoadListWiki: false,
            firstWiki: this.state.listWiki[0]
          });
          Notification('success', 'Delete', 'Delete thành công')
        }
      })

    }
  }

  // Chỉnh sửa Description của Wiki
  EditWiki(e) {
    this.setState({ isLoad: true, isLoadHis: true });
    api.EditWikiDes(e, (err, result) => {
      if (err) {
        this.setState({ isLoad: false, isLoadHis: false });
        Notification("error", "Error", err)
        return;
      } else {
        this.setState({
          description: result.html, isLoad: false, isLoadHis: false
        })
        this.getWikiHistory(JSON.parse(localStorage.getItem('wiki')).id)
        let x = {
          id: result.id,
          version: result.version
        }
        localStorage.setItem('wiki', JSON.stringify(x))
        Notification("success", "Edit", "Chỉnh sửa mô tả thành công")
        api.getTimeline((err, result) => {
          if (err) {
            return;
          } else {
            this.setState({
              listWiki: result
            })
          }
        })
      }
    })
  }
  //Lấy Lịch sử của wiki
  getWikiHistory(id) {
    this.setState({ isLoadHis: true });
    api.getWikiHistory(id, (err, result) => {
      if (err) {
        this.setState({ isLoadHis: false });
        Notification("error", "Error", err)
        return;
      } else {
        this.setState({
          history: result,
          isLoadHis: false
        });
      }
    })
  }
  //Lấy list file
  getListAttachments() {
    this.setState({
      isLoadFile: true
    });
    api.getListAttachments((err, result) => {
      if (err) {
        this.setState({ isLoadFile: false });
        Notification("error", "Error", err)
        return;
      } else {
        this.setState({
          isOpenUpload: true,
          listFile: result,
          isLoadFile: false
        });
      }
    })
  }
  //Add File
  uploadFiles(file) {
    // console.log( api.Addfile())
    api.Addfile(file, (err, result) => {
      if (err) {
        this.setState({ isLoad: false, percentage: 0 });
        Notification("error", "Delete", err)
        return;
      } else {
        var listFile = utils.copyState(this.state.listFile)
        listFile.push(result)
        this.setState({ percentage: 0, listFile: listFile });
        this.getWikiHistory(JSON.parse(localStorage.getItem('wiki')).id)
        Notification('success', 'Success', 'UpLoad thành công')
      }
    }
      ,
      (process) => {
        this.setState({
          percentage: process
        });
      })
  }

  //
  // async uploadFiles(e) {

  //   const promises = [];

  //   promises.push(this.AddFile(e))
  //   try {
  //     await Promise.all(promises);

  //   } catch (e) {
  //   }
  // }
  // AddFile(e) {
  //   return new Promise((resolve, reject) => {
  //     const req = new XMLHttpRequest();
  //     const data = new FormData()
  //     data.append('project', JSON.parse(localStorage.getItem('project')).id)
  //     data.append('object_id', JSON.parse(localStorage.getItem('wiki')).id)
  //     data.append('attached_file', e)
  //     data.append('from_comment', false)

  //     req.open("POST", "http://80.211.131.237:3001/api/v1/wiki/attachments", true);
  //     req.upload.addEventListener("progress", (event) => {
  //       if (event.lengthComputable) {
  //         var complete = (event.loaded / event.total * 100 | 0);
  //         this.setState({ percentage: complete });
  //       }
  //     });
  //     req.addEventListener("load", event => {

  //       if ((req.status) === 500) {
  //         this.setState({ percentage: 0, files: null });
  //         Notification('error', 'Error', 'UpLoad thất bại')
  //       }
  //       else {
  //         var listFile = utils.copyState(this.state.listFile)
  //         listFile.push(JSON.parse(req.response))
  //         this.setState({ percentage: 0, files: null, listFile: listFile });
  //         Notification('success', 'Success', 'UpLoad thành công')
  //         this.getWikiHistory(JSON.parse(localStorage.getItem('wiki')).id)
  //       }
  //       resolve(req.response);
  //     });

  //     req.setRequestHeader("Authorization", 'Bearer ' + JSON.parse(localStorage.getItem('userInfo')).token);
  //     req.send(data);
  //   });
  // }

  //Xóa File
  DeleteFile(id) {
    var listFile = utils.copyState(this.state.listFile)
    listFile.map((val, key) => {
      if (val.id === id) {
        var index = listFile.indexOf(val)
        listFile.splice(index, 1)
      }
      return null;
    }
    )
    this.setState({ isLoadHis: true, isLoadFile: true });
    api.DeleteFile(id, (err, result) => {
      if (err) {
        this.setState({ isLoadHis: false, isLoadFile: false });
        Notification("error", "Error", err)
      }
      else {
        this.setState({ isLoadHis: false, isLoadFile: false, listFile: listFile });
        Notification('success', 'Delete', 'Delete thành công')
        this.getWikiHistory(JSON.parse(localStorage.getItem('wiki')).id)
      }
    })
  }
  getWiki(event) {
    if (event !== this.state.idWiki) {
      this.setState({ isLoadHis: true, isLoadFile: true });
      this.state.listWiki.map((val, key) => {
        if (val.id === event) {
          let x = {
            id: val.id,
            version: val.version
          }
          localStorage.setItem('wiki', JSON.stringify(x))
          this.setState({
            openDes: true,
            idWiki: event,
            username: val.owner.full_name,
            wikiName: val.subject,
            isLoadMore: true,
            description: val.html,
          })
          this.getWikiHistory(val.id)
          this.getListAttachments()
        }
        return null;
      })
    }
  }

  componentWillMount() {
    this.getTimeline()
  }

  render() {
    return (

      <React.Fragment>

        <Container fluid className="p-0">
          <Row className="Wiki">
            <Col md="3" xl="3">
              <ListWiki firstWiki={this.state.firstWiki} isLoad={this.state.isLoadListWiki} getWiki={this.getWiki} CreateWiki={this.CreateWiki} listWiki={this.state.listWiki} DeleteWiki={this.DeleteWiki} />
            </Col>
            <Col md="9" xl="9">
              <Content progress={this.state.percentage} isLoadFile={this.state.isLoadFile} isLoadHis={this.state.isLoadHis} isLoad={this.state.isLoad} openDes={this.state.openDes} isLoadMore={this.state.isLoadMore} isOpenUpload={this.state.isOpenUpload} listFile={this.state.listFile} DeleteFile={this.DeleteFile} AddFile={this.uploadFiles} wikiName={this.state.wikiName} username={this.state.username} description={this.state.description} history={this.state.history} EditWiki={this.EditWiki} />
            </Col>
          </Row>
        </Container>

      </React.Fragment>
    );
  }
}

export default Wiki;


