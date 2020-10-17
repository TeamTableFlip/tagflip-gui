## [2.0.1](https://github.com/fhswf/tagflip-gui/compare/v2.0.0...v2.0.1) (2020-09-26)


### Bug Fixes

* make backend paths relative to allow context root ([a0a0f80](https://github.com/fhswf/tagflip-gui/commit/a0a0f80cd0100d185876add111c1643bddd72bcc))

# [2.0.0](https://github.com/fhswf/tagflip-gui/compare/v1.2.1...v2.0.0) (2020-09-25)


### Features

* Support for Annotation Tasks ([42ae7d6](https://github.com/fhswf/tagflip-gui/commit/42ae7d6f05ac33daf576ea030699b911b9742f81))


### BREAKING CHANGES

* Release loses any compatibility to prior releases due
to heavy changes on domain model.

## [1.2.1](https://github.com/fhswf/tagflip-gui/compare/v1.2.0...v1.2.1) (2020-08-25)


### Bug Fixes

* Overflow scrolling for editor view ([66b5250](https://github.com/fhswf/tagflip-gui/commit/66b52509d07adbb53d36649ae115780e1ad856a9))

# [1.2.0](https://github.com/fhswf/tagflip-gui/compare/v1.1.5...v1.2.0) (2020-08-25)


### Bug Fixes

* added missing parameter value ([529555e](https://github.com/fhswf/tagflip-gui/commit/529555ebbb40f20f79bb7b32bd8ff4dc94638413))
* fix release.yml ([a8f0682](https://github.com/fhswf/tagflip-gui/commit/a8f068297c592ad5d4a69103eda3f2a25db2d13c))
* npmjs is new registry ([12678ab](https://github.com/fhswf/tagflip-gui/commit/12678aba4e0a4faa75dccfd56d4b6fa02000f09e))


### Features

* Adding possibility to filter by field on search via DataTable ([f1e6992](https://github.com/fhswf/tagflip-gui/commit/f1e699203afaf18ba324bb0a8d7d8e2367301779))
* Improving performance on document table in corpus settings ([9b583ab](https://github.com/fhswf/tagflip-gui/commit/9b583ab2bd754c12baa551021b7c75610573b266))

## [1.1.4](https://github.com/fhswf/tagflip-gui/compare/v1.1.3...v1.1.4) (2020-08-14)


### Bug Fixes

* add page for / ([01040b6](https://github.com/fhswf/tagflip-gui/commit/01040b6792538fecce105a5558cbeb1c86e5bf83))

## [1.1.3](https://github.com/fhswf/tagflip-gui/compare/v1.1.2...v1.1.3) (2020-08-11)


### Bug Fixes

* Fixed editing of annotations. ([3483fa7](https://github.com/fhswf/tagflip-gui/commit/3483fa7a62731897b243747256d304d97fa7807d))

## [1.1.2](https://github.com/fhswf/tagflip-gui/compare/v1.1.1...v1.1.2) (2020-08-11)


### Bug Fixes

* type safety - migration to typescript ([d0a33c1](https://github.com/fhswf/tagflip-gui/commit/d0a33c18ddf5c846483f0440b37d889d9ca0439c))

## [1.1.1](https://github.com/fhswf/tagflip-gui/compare/v1.1.0...v1.1.1) (2020-08-10)


### Bug Fixes

* make CorpusDetails type safe ([2cf0b2d](https://github.com/fhswf/tagflip-gui/commit/2cf0b2d94b1c758afd06b3baec803680134fec4b))

# 1.0.0 (2020-08-09)


### Bug Fixes

* allow relative path in production ([0938734](https://github.com/fhswf/tagflip-gui/commit/0938734a8236fb6df374d72e51068f69dfe75ef8))
* Correct github repo link in package.json ([606828e](https://github.com/fhswf/tagflip-gui/commit/606828e5a3c0352151caf0e031acd67297fb84f4))
* do not persist activeCorpus in localStorage - it's usually exceeding the quota ([1f5e62f](https://github.com/fhswf/tagflip-gui/commit/1f5e62f83344c06346bfc526b62fda5c83cc2cd5))
* extract CSS in a separate file ([49d4ff4](https://github.com/fhswf/tagflip-gui/commit/49d4ff49c9719302ff3d7264f9b55c36a1d1cafe))
* fix semantic release ([b7bdfbc](https://github.com/fhswf/tagflip-gui/commit/b7bdfbcca24abd444088f23d6896c0628d4ed873))
* fix sematic release ([8b96259](https://github.com/fhswf/tagflip-gui/commit/8b962596d5f855943f2b323942b74730c1497380))
* Issue with State type fixed. ([bef427b](https://github.com/fhswf/tagflip-gui/commit/bef427b6fec6056e9b8b99ee606d9408306d9693))
* Pack CSS in a .css file to improve compability with CSP headers ([23a27fd](https://github.com/fhswf/tagflip-gui/commit/23a27fd9137bbcce32d1435adc7559d812f3654c))


### Features

* Changes for codemirror 6 (ViewPlugin) ([25971ba](https://github.com/fhswf/tagflip-gui/commit/25971bad95c01068db044c68ed11d9b0470929c6))
* CodeMirror 6 to support overlapping tags. ([3930dc3](https://github.com/fhswf/tagflip-gui/commit/3930dc30bd18127c26ecc5a4cf39ba0fc81afe0b))
* implement import in UI ([ff0cd39](https://github.com/fhswf/tagflip-gui/commit/ff0cd39957f8e37f55251684f6d5b58b5f5613aa))
