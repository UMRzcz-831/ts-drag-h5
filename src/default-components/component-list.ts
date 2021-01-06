// 公共样式
const commonStyle = {
  rotate: '',
  opacity: 1
}
// 编辑器左侧组件列表
const list = [
  {
    component: 'umr-text',
    label: '文字组件',
    propValue: '文字',
    icon: 'icon-type',
    animations: [],
    events: {},
    style: {
      width: 200,
      height: 33,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: ''
    }
  },
  {
    component: 'umr-field',
    label: '输入框组件',
    propValue: '',
    Umrplaceholder: '这是一个输入框',
    icon: 'icon-italic',
    pswdMode: false,
    animations: [],
    events: {},
    style: {
      width: 200,
      height: 33,
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: ''
    }
  },
  {
    component: 'umr-button',
    label: '按钮',
    propValue: '按钮',
    icon: 'icon-hashtag',
    animations: [],
    events: {},
    ButtonType: '',
    style: {
      width: 100,
      height: 40,
      borderWidth: '',
      borderColor: '',
      borderRadius: '',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '',
      backgroundColor: ''
    }
  },
  {
    component: 'umr-picture',
    label: '图片组件',
    icon: 'icon-image',
    propValue: require('@/assets/logo.png'),
    animations: [],
    events: {},
    style: {
      width: 300,
      height: 200,
      borderRadius: ''
    }
  }
]

list.forEach(item => {
  item.style = { ...item.style, ...commonStyle }
})

export default list
