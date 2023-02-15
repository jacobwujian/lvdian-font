import store from '@/store'
// export const PERMISSION_ENUM = {
//   'organization': {
//     'Check': '审核',
//     'Edit': '修改',
//     'Detail': '详情',
//     'length': 3
//   },
//   'project': {
//     'Add': '新增',
//     'Check': '审核',
//     'Detail': '详情',
//     'Delete': '删除',
//     'Edit': '修改',
//     'Stop': '暂停',
//     'Termination': '终止',
//     'Verification': '核销',
//     'Launch': '启用',
//     'AssetDetail': '详情',
//     'length': 10
//   },
//   'device': {
//     'Stop': '暂停',
//     'Launch': '启动',
//     'Delete': '删除',
//     'Revoke': '吊销',
//     'Edit': '修改',
//     'Import': '导入',
//     'Detail': '详情',
//     'length': 7
//   },
//   'deal': {
//     'Detail': '详情',
//     'length': 1
//   },
//   'verification': {
//     'Check': '审核',
//     'Detail': '详情',
//     'length': 2
//   },
//   'role': {
//     'Detail': '详情',
//     'Add': '新增',
//     'Edit': '修改',
//     'length': 3
//   },
//   'account': {
//     'Detail': '详情',
//     'Edit': '修改',
//     'Add': '新增',
//     'length': 3
//   }
// }

/**
 * $auth权限
 * eg: <a-button v-if="$auth('form.edit')" @click="edit(record)">修改</a-button>
 * -------------------- 各按钮权限名称 --------------------
 * organizationCheck  机构
 * organizationEdit
 * organizationDetail
 * projectAdd  项目
 * projectCheck
 * projectDetail
 * projectDelete
 * projectEdit
 * projectStop
 * projectTermination
 * projectVerification
 * projectLaunch
 * projectAssetDetail  项目详情 -- 资产列表：详情
 * projectVerification  项目详情 -- 资产列表：核销
 * deviceStop  设备
 * deviceLaunch
 * deviceDelete
 * deviceRevoke
 * deviceEdit
 * deviceImport
 * dealDetail  交易
 * verificationCheck  核销
 * verificationDetail
 */

/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param Vue
 */
function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return (permissions) => {
          const permissionCodes = store.getters.userInfo && store.getters.userInfo.permissionCodes
          if (permissionCodes && permissionCodes.includes(permissions)){
            return true
          }else{
            return false
          }
        }
      }
    }
  })
}

export default plugin
