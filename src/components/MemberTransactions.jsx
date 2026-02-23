import dayjs from "dayjs";

export default function MemberTransactions({memberData}) {
    return (
        <div className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-md md:text-2xl font-bold text-green-900 mb-8 flex items-center gap-3 justify-center">
                    Transaction History
                </h3>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-800 mb-4">Recent Transactions</h4>

                    {memberData?.transactions && memberData?.transactions.length > 0 ? (
                        <div className="space-y-3">
                            {[...memberData?.transactions]
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div>
                                                            <p className="font-semibold text-green-900">
                                                                {transaction.description || 'Payment'}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">

                                                                {transaction.transactionId && (
                                                                    <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                                                                        ID: {transaction.transactionId}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-green-900">
                                                            ₹{parseFloat(transaction.amount || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {dayjs(transaction?.date).format('DD MMM YYYY, hh:mm A')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MdCurrencyRupee className="w-10 h-10 text-green-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-green-800 mb-2">No Transactions Yet</h4>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Your transaction history will appear here once you make payments for membership or contributions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}