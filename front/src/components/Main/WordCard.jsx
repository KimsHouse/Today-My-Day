import './WordCard.css'
import React, { useState, useCallback, useEffect } from 'react'
import $, { data, get } from 'jquery'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { RedoOutlined, HeartOutlined, PlusOutlined, ExclamationOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styled from 'styled-components'
import Zoom from 'react-reveal/Zoom'
import LightSpeed from 'react-reveal/LightSpeed'

const MainExplain = styled.h1`
  padding-top: 5%;
  font-size: 300%;
  color: #38532e;
`
const MainBack = styled.div`
  background-color: pink;
`
const allOpen = styled.div`
  margin-bottom: 10px;
`

function WordCard() {
  const navigate = useNavigate()
  const { wordGet } = useSelector((state) => state.word)
  const [word, setWord] = useState([])

  const pageMove = (e) => {
    navigate('/my/article', { state: e.target.innerHTML })
  }
  const wordShuffle = () => {
    window.location.replace('/main')
  }

  $('.card').on('click', function () {
    $('.cardRotate').addClass('backRotate').removeClass('cardRotate')
    $(this).addClass('cardRotate').removeClass('backRotate')
  })
  // $(document).on('ready', function () {
  //   $('.envelope-wrapper .heart').on('click', function () {
  //     $('.envelope-wrapper').addClass('flap')
  //   })

  //   $('.envelope-wrapper .close-icon').on('click', function () {
  //     $('.envelope-wrapper').removeClass('flap')
  //   })
  // })
  for (let index = 0; index < 5; index++) {
    $(document).ready(function () {
      $('.envelope-wrapper .open' + index).click(function () {
        $('.card' + index).addClass('flap')
      })

      $('.envelope-wrapper .close' + index).click(function () {
        $('.card' + index).removeClass('flap')
      })
    })
  }
  // $(document).ready(function () {
  //   $('.all .allopen').click(function () {
  //     $('.all').addClass('flap')
  //   })
  // })
  $(document).ready(function () {
    $('.all').click(function () {
      $('.envelope-wrapper').addClass('flap')
    })
  })
  return (
    <>
      {/* {wordGet != null
        ? wordGet.map((item) => (
            <div key={item} className="card card1">
              <div className="front" onClick={pageMove}>
                {item}
              </div>
            </div>
          ))
        : null} */}
      <MainBack>
        {' '}
        <MainExplain>오늘의 단어를 선택해보세요</MainExplain>
        {wordGet != null
          ? wordGet.map((item, i) => (
              <Zoom>
                <div key={item} className="bg-wrapper">
                  <div className={'envelope-wrapper card' + i}>
                    <div className="envelope">
                      <div className="card">
                        <span className={'fa fa-close close-icon close' + i}>X</span>
                        <div className="text" style={{ cursor: 'pointer' }} onClick={pageMove}>
                          {item}
                        </div>
                      </div>
                    </div>
                    <div className={'heart open' + i}>
                      <ExclamationOutlined style={{ color: 'transparent' }} />
                      {/* <PlusOutlined style={{ color: '#c51803' }} /> */}
                    </div>
                  </div>
                </div>
              </Zoom>
            ))
          : null}
        <allOpen className="all">
          <Button>전체 열기</Button>{' '}
        </allOpen>
        <RedoOutlined style={{ fontSize: '150%', cursor: 'pointer' }} onClick={wordShuffle} />
      </MainBack>
    </>
  )
  // <div>
  //   <div className="card card1">
  //     <div className="front"></div>
  //     <div className="back"></div>
  //   </div>
  //   <div className="card card2">
  //     <div className="front"></div>
  //     <div className="back"></div>
  //   </div>
  //   <div className="card card3">
  //     <div className="front"></div>
  //     <div className="back"></div>
  //   </div>
  //   <div className="card card4">
  //     <div className="front"></div>
  //     <div className="back"></div>
  //   </div>
  //   <div className="card card5">
  //     <div className="front"></div>
  //     <div className="back"></div>
  //   </div>
  // </div>
}

export default WordCard
