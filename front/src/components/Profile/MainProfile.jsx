import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { EditOutlined } from '@ant-design/icons'
import { getAxios } from '../../api'
import ImageFileInput from '../ImageFileInput'
import './MyPicture.css'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Modal, Avatar, Select } from 'antd'
import { loadUserRequestAction } from '../../reducers/user'
import { useNavigate } from 'react-router-dom'
import DeleteAccount from './DeleteAccount'
const { Option } = Select
const Gender = styled.div`
  margin-top: 5%;
  text-align: left;
  margin-left: 25%;
`
const MyNick = styled.div`
  margin-top: 10%;
  text-align: left;
  margin-left: 25%;
`
const Age = styled.div`
  margin-top: 5%;
  text-align: left;
  margin-left: 25%;
  width: 40%;
  display: flex;
`

function MainProfile({ imageUploader, data }) {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.user)
  const [form] = Form.useForm()

  const [file2, setFile2] = useState({ fileName: null, fileURL: null })
  const [editable, setEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [nick, setNick] = useState('')
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onFileChange = (file2) => {
    setFile2({
      fileName: file2.name,
      fileURL: file2.url,
    })
  }
  const [image, setImage] = useState({
    fileURL: '/images/기본사진.png',
  })

  const onFinish = async (values) => {
    const axios = getAxios()
    me !== null &&
      me.userId !== null &&
      file2.fileURL !== null &&
      (await axios.put(
        'user/modify',
        { image: file2.fileURL, age: me.age, gender: me.gender },
        { params: { userId: me.userId } },
      ))
    dispatch(loadUserRequestAction({ userId: me.userId }))
    changePic()
  }

  const onDelete = async (values) => {
    const axios = getAxios()
    me !== null &&
      me.userId !== null &&
      (await axios.put(
        'user/modify',
        { image: image.fileURL, age: me.age, gender: me.gender },
        { params: { userId: me.userId } },
      ))
    setFile2({ fileName: null, fileURL: null })
    dispatch(loadUserRequestAction({ userId: me.userId }))
    // setEditable(!editable)
  }

  const loadMoreData = (userId) => {
    if (loading) {
      return
    }
    dispatch(loadUserRequestAction({ userId: me.userId }))
    setLoading(true)
    // setNick(me.nickname)
  }

  const onAge = async (values) => {
    const axios = getAxios()
    me !== null &&
      me.userId !== null &&
      (await axios.put(
        'user/modify',
        { age: values.ageRange, image: me.image, gender: me.gender, nickname: me.nickname },
        { params: { userId: me.userId } },
      ))
    me.age = values.ageRange
  }

  // const updateNickname = async () => {
  //   const axios = getAxios()
  //   // me !== null &&
  //   //   me.userId !== null &&
  //   const res = await axios.put(
  //     'user/modify',
  //     { age: me.age, image: me.image, gender: me.gender, nickname: nick },
  //     { params: { userId: me.userId } },
  //   )
  // }

  const showAge = (e) => {
    if (e == 1) {
      return '어린이 (0~9)'
    } else if (e == 2) {
      return '청소년 (10~19)'
    } else if (e == 3) {
      return '청년 (20~29)'
    } else if (e == 4) {
      return '중/장년 (30~59)'
    } else if (e == 5) {
      return '노년 (60~)'
    }
  }
  const success = () => {
    Modal.success({
      content: '연령대 수정이 완료되었습니다.',
    })
  }
  const changePic = () => {
    Modal.success({
      content: '사진이 등록되었습니다.',
    })
  }
  const checkGender = () => {
    if (me != null && me.gender === 'male') {
      return '남'
    } else {
      return '여'
    }
  }
  useEffect(() => {
    if (me != null) {
      if (me.userId != null) {
        loadMoreData(me.userId)
      }
    }
  }, [me])
  return (
    <div>
      <EditOutlined
        onClick={(e) => {
          setEditable(!editable)
        }}></EditOutlined>
      <div className="myPic">
        {editable === false ? (
          <div>
            <Avatar
              size={300}
              style={{ background: '#ccc', border: 'soild' }}
              icon={<img src={me !== null && me.image}></img>}></Avatar>
          </div>
        ) : (
          <Form form={form} name="modify" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Avatar
              size={300}
              icon={
                me.image !== null && (
                  <ImageFileInput
                    name={file2.fileName}
                    imageUploader={imageUploader}
                    onFileChange={onFileChange}
                    file={file2}
                    // form={form}
                    data={data}
                    setFile={setFile2}
                  />
                )
              }
            />{' '}
            <Form.Item>
              <Button type="danger" htmlType="submit" onClick={showModal}>
                삭제
              </Button>
              <Modal
                title="프로필 이미지 삭제"
                visible={isModalVisible}
                onOk={() => {
                  onDelete()
                  handleCancel()
                }}
                onCancel={handleCancel}>
                <p>삭제하시겠습니까?</p>
              </Modal>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  onFinish()
                }}>
                등록
              </Button>
            </Form.Item>{' '}
          </Form>
        )}
      </div>
      <div>
        {/* {editable === false ? (
          <MyNick>닉네임 : {me !== null && me.nickname}</MyNick>
        ) : (
          <MyNick>
            닉네임 :{' '}
            <Form
              form={form}
              name="modify"
              onFinish={updateNickname}
              autoComplete="off"
              layout="vertical">
              <Form.Item>
                <input type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                <Button
                  type="primary"
                  onClick={() => {
                    updateNickname()
                  }}>
                  등록
                </Button>
              </Form.Item>
            </Form>
          </MyNick>
        )} */}
        <MyNick>닉네임 : {me !== null && me.nickname}</MyNick>
      </div>
      <div>
        {editable === false ? (
          <Age>연령대 : {me !== null && showAge(me.age)} </Age>
        ) : (
          <Age>
            연령대 :
            <Form form={form} name="modify" onFinish={onAge} autoComplete="off" layout="vertical">
              <Form.Item
                name="ageRange"
                rules={[
                  {
                    required: false,
                    message: 'Please select ageRange!',
                  },
                ]}>
                <Select defaultValue={me.age} placeholder="Select your ageRange">
                  <Option value="1">어린이 (0~9)</Option>
                  <Option value="2">청소년 (10~19)</Option>
                  <Option value="3">청년 (20~29)</Option>
                  <Option value="4">중/장년 (30~59)</Option>
                  <Option value="5">노년 (60~)</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={success}>
                  등록
                </Button>
              </Form.Item>
            </Form>{' '}
          </Age>
        )}
      </div>
      <Gender>성별 : {checkGender()}</Gender>
      <br></br>
      <DeleteAccount></DeleteAccount>
    </div>
  )
}
export default MainProfile
