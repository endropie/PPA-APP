<template>
  <div class="page-print shadow-2" >
    <table style="page-break-after: always;width100%; max-width: calc(100vw - 20px);">
    <thead>
      <tr >
        <td class="page-print-header">
          <slot name="header">
            <div class="header no-wrap row items-start" >
              <div class="head-icon self-center">
                <slot name="'header-icon'">
                  <q-avatar color="transparent" text-color="primary" icon="widgets" rounded />
                  <!-- <div>
                    <q-icon  name="widgets" color="primary" class=""/>
                  </div> -->
                </slot>
              </div>
              <div class="head-brand row no-wrap">
                <div class="col-grow brand text-no-wrap ">
                  <div  class="title text-weight-bolder uppercase ellipsis text-truncate" style="opacity:0.8">
                    <slot name="header-title">
                      <span>Priuk Perkasa Abadi, PT</span>
                    </slot>
                  </div>
                  <div class="subtitle text-weight-light ellipsis text-truncate">
                    <slot name="header-subtitle">
                      <span>Jalan Jati Raya Blok J3 No.7, Cikarang Selatan, Bekasi, Jawa Barat 17530</span>
                    </slot>
                  </div>
                </div>
                <div class="col-auto no-print">
                  <slot name="header-tags"></slot>
                </div>
              </div>
            </div>
          </slot>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="page-print-body">
          <slot></slot>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="page-print-footer">
          <slot name="footer"></slot>
        </td>
      </tr>
    </tfoot>
  </table>
  </div>
</template>


<script>
export default {
  name :'page-print',
}
</script>
<style lang="stylus">
.page-print
  display inline-table
  .page-print-header, .page-print-footer
    padding 5px 10px
  .page-print-body
    font-size 14px
    padding 10px 20px
  .header
    .head-icon
      .q-icon
        font-size 50px

    .head-brand
      min-width calc(100% - 70px)
      padding 5px 0px

      .title
        font-size 32px
        line-height 100%
        span
          line-height 1.12
          letter-spacing 0.02em
      .subtitle
        font-size 80%
        // line-height 0.12
        letter-spacing -0.02em

    .head-tags
      float right
      -webkit-box-pack justify
      -ms-flex-pack justify
      justify-content space-between


  .header.reverse
    .head-tags
      float left
      justify-content space-start

.super-dense .q-table
  th:last-child,
  td:last-child
    padding-right: 8px
  th, td
    padding: 2px 6px

.profile
  font-size:14px
  line-height 1.42857143
  address
    white-space: pre-wrap;
    font-style normal
.info
  dl.horizontal dt
    text-align left
  dl.horizontal.right dt
    text-align right

.identity .q-item-main .q-item-label
  text-weight bolder



.page-print.right
  .header.row
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;

.page-print.header-minimaze
  .header
    border-bottom solid 0.5px rgba(125, 125, 125, 0.5)
    .head-icon .q-icon
      font-size 40px
    .head-brand
      min-width calc(100% - 40px)
    .head-brand .title
      font-size 18px
    .head-brand .subtitle
      font-size 11px
    .head-brand .tags
      .q-chip
        font-size 12px
        min-height 1px
        padding 0 3px
        .q-chip-main
          padding 2px
      .q-chip.q-chip-tag
        padding-left 1.3rem


@media print
  body
    margin 0
  .q-table__container
    background-color transparent
  .q-page-container
    padding-top: unset !important
    // padding 5px !important

  .page-print
    display block
    box-shadow none
    -webkit-box-shadow none

    .page-print-header, .page-print-footer
      padding 0px !important

    .page-print-body
      padding 10px !important

    .page-print-header
      display table-header-group

    .page-print-footer
      display table-row-group



  // setting customize required
  .page-print:after
    display block
    page-break-after always
    content ''
  // page-break-after => always
  .q-layout-page-container.q-layout-transition
    padding 0px !important



</style>
