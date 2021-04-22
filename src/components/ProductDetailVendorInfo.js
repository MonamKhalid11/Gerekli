import React from 'react';
import Section from './Section';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../utils/i18n';
import { stripTags } from '../utils';
import config from '../config';
import { VERSION_MVE } from '../constants';
import * as nav from '../services/navigation';

const styles = EStyleSheet.create({});

export const ProductDetailVendorInfo = ({ vendor }) => {
  if (config.version !== VERSION_MVE || !vendor) {
    return null;
  }

  return (
    <Section title={i18n.t('Vendor')} wrapperStyle={styles.noPadding}>
      <View style={styles.vendorWrapper}>
        <Text style={styles.vendorName}>{vendor.company}</Text>
        <Text style={styles.vendorProductCount}>
          {i18n.t('{{count}} item(s)', { count: vendor.products_count })}
        </Text>
        <Text style={styles.vendorDescription}>
          {stripTags(vendor.description)}
        </Text>
        <TouchableOpacity
          style={styles.vendorInfoBtn}
          onPress={() => {
            nav.showModalVendorDetail({
              vendorId: vendor.company_id,
            });
          }}>
          <Text
            style={styles.sectionBtnText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {i18n.t('Details')}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.sectionBtn}
        onPress={() => {
          nav.showModalVendor({
            companyId: vendor.company_id,
          });
        }}>
        <Text style={styles.sectionBtnText}>{i18n.t('Go To Store')}</Text>
      </TouchableOpacity>
    </Section>
  );
};
