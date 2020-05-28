
export const orderCodeToText = (val) => {
    if (!val) return "";

    switch (val) {
      // 住房状态
      case "live":
        return "正住";
      case "left":
        return "已退";
      case "no_live":
        return "未入住";
      // 渠道
      case "offline":
        return "线下客人";
      // 支付类型
      case "spot_pay":
        return "现付";
      case "advance_pay":
        return "预付";
      // 订单类型
      case "daily":
        return "日租房";
      case "hour_room":
        return "钟点房";
      // 订单状态
      case "confirmed":
        return "已确认";
      case "completed":
        return "已完成";
      // 消费类型
      case "rent":
        return "房租";
      case "rent_manual":
        return "手动房租";
      case "commodity":
        return "商品";
      case "cleaning_charge":
        return "清洗费";
      case "damage":
        return "赔偿";
      case "offset":
        return "冲账";
      // 收入/支出
      case "income":
        return "收入";
      case "outgoings":
        return "支出";
      // 收款项目
      case "receipts":
        return "收款";
      case "refund":
        return "退款";
      case "deposit":
        return "订金";
      // 支付方式
      case "cash":
        return "现金";
      case "wechat":
        return "微信";

      default:
        return val;
    }
  }