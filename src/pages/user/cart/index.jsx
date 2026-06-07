import React from 'react'
import dynamic from 'next/dynamic'
import { HeadTitle } from '@/components/HeadTitle'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import { useTranslation } from "react-i18next";

const CartView = dynamic(() => import('@/views/CartView'), { 
  ssr: false 
})

const Index = () => {
  const { t } = useTranslation();
  return (
    <div>
      <HeadTitle title={t("cart")}/>
      <BreadCrumb/>
      <CartView/>
    </div>
  )
}

export default Index
