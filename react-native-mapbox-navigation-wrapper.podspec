require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-mapbox-navigation-wrapper'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = { :type => 'MIT' }
  s.homepage     = 'https://github.com/your-org/react-native-mapbox-navigation-wrapper'
  s.authors      = { 'Your Organization' => 'engineering@example.com' }
  s.platforms    = { :ios => '14.0' }
  s.source       = { :git => 'https://github.com/your-org/react-native-mapbox-navigation-wrapper.git', :tag => s.version.to_s }
  s.source_files = 'ios/**/*.{h,m,mm,swift}'
  s.swift_version = '5.9'

  s.dependency 'React-Core'
  s.dependency 'MapboxNavigation', '~> 3.25'
end
