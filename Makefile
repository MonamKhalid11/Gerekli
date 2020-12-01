DEFAULT_BUNDLE_ID=com.simtech.multivendor

# .SILENT:build
.PHONY: change ios android
change:
	@rm -rf android/app/src/main/res
	@rm -rf ios/csnative/Images.xcassets
	@cp -R ./users/${USER}/src ./
	@cp -R ./users/${USER}/ios ./
	@cp -R ./users/${USER}/android ./