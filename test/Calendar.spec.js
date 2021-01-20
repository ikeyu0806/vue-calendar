import { mount } from '@vue/test-utils'
import Calendar from '@/components/Calendar.vue'

describe('Calendar', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.vm).toBeTruthy()
  })
})
