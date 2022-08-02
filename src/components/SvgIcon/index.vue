<template>
<div><svg :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="iconName"/>
    </svg></div>
    
</template>
 
<script>
    export default {
        name: 'SvgIcon',
        props: {
            iconClass: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            },
            styleExternalIcon() {
                return {
                    mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                    '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
                }
            }
        }
    }
</script>
 
<style scoped>
.svg-icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.18em;
  fill: currentColor;
  overflow: hidden;
}
    /* .svg-icon {
        width: 1.5em;
        height: 1.5em;
        height: 60px;
        width: 80px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    } */
 
    .svg-external-icon {
        background-color: currentColor;
        mask-size: cover!important;
        display: inline-block;
    }
</style>